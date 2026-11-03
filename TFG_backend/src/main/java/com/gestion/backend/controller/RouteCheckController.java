package com.gestion.backend.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Analiza una ruta GPX contra los perímetros de los parques naturales.
 *
 * Cada petición trabaja en su propio directorio temporal, que se borra al terminar,
 * y el resultado (parques + tramos en GeoJSON) se devuelve en la propia respuesta.
 * Así no hay ficheros compartidos entre usuarios.
 */
@RestController
@RequestMapping("/api/routes")
public class RouteCheckController {

    private static final long SCRIPT_TIMEOUT_SECONDS = 60;

    private final ObjectMapper objectMapper;

    // Cada análisis lanza un proceso de Python (~60 MB). Se limita cuántos corren a la vez para que
    // una ráfaga de peticiones no agote la memoria de la instancia (512 MB en Render Free).
    private final Semaphore analysisSlots;

    @Value("${parktracker.python:python3}")
    private String pythonPath;

    @Value("${parktracker.script-path:/app/scripts/CheckRoute.py}")
    private String scriptPath;

    @Value("${parktracker.coordinates-dir:/app/park_data/coordinates}")
    private String coordinatesDir;

    public RouteCheckController(ObjectMapper objectMapper,
            @Value("${parktracker.max-concurrent-analyses:2}") int maxConcurrentAnalyses) {
        this.objectMapper = objectMapper;
        this.analysisSlots = new Semaphore(maxConcurrentAnalyses);
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkRoute(@RequestParam("route") MultipartFile file) {
        String originalName = file.getOriginalFilename();
        if (file.isEmpty() || originalName == null || !originalName.toLowerCase().endsWith(".gpx")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Debes subir un archivo .gpx no vacío"));
        }

        if (!analysisSlots.tryAcquire()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .header("Retry-After", "10")
                    .body(Map.of("error", "El servidor está ocupado analizando otras rutas. Inténtalo en unos segundos"));
        }

        Path workDir = null;
        try {
            workDir = Files.createTempDirectory("parktracker-");
            // El nombre lo decide el servidor: nunca se usa el nombre enviado por el cliente
            Path gpxPath = workDir.resolve("route.gpx");
            file.transferTo(gpxPath);

            JsonNode result = runScript(gpxPath);
            return ResponseEntity.ok(result);

        } catch (ScriptException e) {
            System.err.println("Error en el análisis de la ruta: " + e.getMessage());
            return ResponseEntity.status(e.status).body(Map.of("error", e.publicMessage));
        } catch (IOException | JacksonException e) {
            System.err.println("Error de E/S al analizar la ruta: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno al analizar la ruta"));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Análisis interrumpido"));
        } finally {
            deleteRecursively(workDir);
            analysisSlots.release();
        }
    }

    private JsonNode runScript(Path gpxPath) throws IOException, InterruptedException, ScriptException {
        Process process = new ProcessBuilder(List.of(pythonPath, scriptPath, gpxPath.toString(), coordinatesDir))
                .start();

        // stdout y stderr se leen en paralelo para que el proceso no se bloquee con el buffer lleno
        CompletableFuture<String> stdout = readAsync(process.getInputStream());
        CompletableFuture<String> stderr = readAsync(process.getErrorStream());

        if (!process.waitFor(SCRIPT_TIMEOUT_SECONDS, TimeUnit.SECONDS)) {
            process.destroyForcibly();
            throw new ScriptException(HttpStatus.GATEWAY_TIMEOUT, "El análisis ha tardado demasiado",
                    "timeout tras " + SCRIPT_TIMEOUT_SECONDS + "s");
        }

        String err = stderr.join();
        if (!err.isBlank()) {
            System.err.println("CheckRoute.py stderr: " + err.trim());
        }

        if (process.exitValue() == 2) {
            throw new ScriptException(HttpStatus.BAD_REQUEST, "El archivo GPX no es válido", err.trim());
        }
        if (process.exitValue() != 0) {
            throw new ScriptException(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno al analizar la ruta",
                    "exit code " + process.exitValue());
        }

        return objectMapper.readTree(stdout.join());
    }

    private static CompletableFuture<String> readAsync(InputStream in) {
        return CompletableFuture.supplyAsync(() -> {
            try (in) {
                return new String(in.readAllBytes(), StandardCharsets.UTF_8);
            } catch (IOException e) {
                return "";
            }
        });
    }

    private static void deleteRecursively(Path dir) {
        if (dir == null) return;
        try (Stream<Path> paths = Files.walk(dir)) {
            paths.sorted(Comparator.reverseOrder()).forEach(p -> p.toFile().delete());
        } catch (IOException e) {
            System.err.println("No se pudo borrar " + dir + ": " + e.getMessage());
        }
    }

    private static class ScriptException extends Exception {
        private static final long serialVersionUID = 1L;
        final HttpStatus status;
        final String publicMessage;

        ScriptException(HttpStatus status, String publicMessage, String detail) {
            super(detail);
            this.status = status;
            this.publicMessage = publicMessage;
        }
    }
}

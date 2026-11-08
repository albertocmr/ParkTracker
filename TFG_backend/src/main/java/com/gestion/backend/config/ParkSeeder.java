package com.gestion.backend.config;

import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.gestion.backend.model.NaturalPark;
import com.gestion.backend.repository.NaturalParkRepository;

/**
 * Carga los parques naturales cuando la tabla está vacía (p. ej. una base de datos
 * recién creada). Si ya hay parques no toca nada, así que no pisa los datos existentes.
 */
@Component
public class ParkSeeder implements CommandLineRunner {

    private static final List<String[]> PARKS = List.of(
        new String[] { "Bahía de Cádiz", "Cádiz", "bahia_cadiz" },
        new String[] { "Cabo de Gata-Níjar", "Almería", "cabo_de_gata_nijar" },
        new String[] { "Del Estrecho", "Cádiz", "del_estrecho" },
        new String[] { "Despeñaperros", "Jaén", "despeniaperros" },
        new String[] { "Los Alcornocales", "Cádiz", "los_alcornocales" },
        new String[] { "Montes de Málaga", "Málaga", "montes_malaga" },
        new String[] { "Doñana", "Huelva", "natural_doniana" },
        new String[] { "Sierra de Andújar", "Jaén", "sierra_andujar" },
        new String[] { "Sierra de Aracena y Picos de Aroche", "Huelva", "sierra_aracena" },
        new String[] { "Sierra de Baza", "Granada", "sierra_baza" },
        new String[] { "Sierra de Cardeña y Montoro", "Córdoba", "sierra_cardenia_montoro" },
        new String[] { "Sierra de Castril", "Granada", "sierra_castril" },
        new String[] { "Sierras de Cazorla, Segura y Las Villas", "Jaén", "sierra_cazorla" },
        new String[] { "Sierra de Grazalema", "Cádiz", "sierra_grazalema" },
        new String[] { "Sierra de Hornachuelos", "Córdoba", "sierra_hornachuelos" },
        new String[] { "Sierra de Huétor", "Granada", "sierra_huetor" },
        new String[] { "Sierra Mágina", "Jaén", "sierra_magina" },
        new String[] { "Sierra María-Los Vélez", "Almería", "sierra_maria_los_velez" },
        new String[] { "Sierra Nevada", "Granada", "sierra_nevada" },
        new String[] { "Sierra de las Nieves", "Málaga", "sierra_nieves" },
        new String[] { "Sierra Morena de Sevilla", "Sevilla", "sierra_norte_sevilla" },
        new String[] { "Sierras de Tejeda, Almijara y Alhama", "Granada", "sierra_tejeda" },
        new String[] { "Sierras Subbéticas", "Córdoba", "sierras_subbeticas" }
    );

    private final NaturalParkRepository repository;

    public ParkSeeder(NaturalParkRepository repository) {
        this.repository = repository;
    }

    // Parques cuya denominación oficial ha cambiado: perimeterfile -> {nombre anterior, nombre actual}.
    // Sierra Norte de Sevilla pasó a llamarse Sierra Morena de Sevilla (Decreto 131/2024).
    private static final Map<String, String[]> RENAMED = Map.of(
        "sierra_norte_sevilla", new String[] { "Sierra Norte de Sevilla", "Sierra Morena de Sevilla" }
    );

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            renameOutdatedParks();
            return;
        }
        repository.saveAll(PARKS.stream()
                .map(p -> new NaturalPark(0, p[0], p[1], p[2]))
                .toList());
        System.out.println("ParkSeeder: cargados " + PARKS.size() + " parques naturales");
    }

    /** Actualiza el nombre en bases de datos ya cargadas; si un administrador lo cambió a mano, no lo toca. */
    private void renameOutdatedParks() {
        RENAMED.forEach((perimeterfile, names) -> repository.findByPerimeterfile(perimeterfile)
                .filter(park -> names[0].equals(park.getName()))
                .ifPresent(park -> {
                    park.setName(names[1]);
                    repository.save(park);
                    System.out.println("ParkSeeder: renombrado " + names[0] + " a " + names[1]);
                }));
    }
}

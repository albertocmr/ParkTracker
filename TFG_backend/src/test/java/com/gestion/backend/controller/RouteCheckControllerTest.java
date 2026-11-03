package com.gestion.backend.controller;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import com.gestion.backend.config.SecurityConfig;

@WebMvcTest(RouteCheckController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
    "auth0.domain=example.eu.auth0.com",
    "auth0.audience=http://parkTracker-api",
    "parktracker.cors.allowed-origins=https://park-tracker.vercel.app"
})
class RouteCheckControllerTest {

    // Para el test de extremo a extremo: ruta a un Python con geopandas y gpxpy instalados
    private static final String TEST_PYTHON = System.getenv("PARKTRACKER_TEST_PYTHON");

    @DynamicPropertySource
    static void scriptProperties(DynamicPropertyRegistry registry) {
        Path backend = Paths.get("").toAbsolutePath();
        registry.add("parktracker.python", () -> TEST_PYTHON == null ? "python3" : TEST_PYTHON);
        registry.add("parktracker.script-path", () -> backend.resolve("src/scripts/CheckRoute.py").toString());
        registry.add("parktracker.coordinates-dir",
                () -> backend.resolve("park_data/coordinates").toString());
    }

    @Autowired
    private MockMvc mvc;

    private static MockMultipartFile gpx(String name, String content) {
        return new MockMultipartFile("route", name, "application/gpx+xml", content.getBytes());
    }

    @Test
    void checkRequiresAuthentication() throws Exception {
        mvc.perform(multipart("/api/routes/check").file(gpx("r.gpx", "<gpx/>")))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsNonGpxFiles() throws Exception {
        mvc.perform(multipart("/api/routes/check").file(gpx("r.txt", "hola")).with(jwt()))
           .andExpect(status().isBadRequest());
    }

    @Test
    void sharedDataIsNoLongerPublic() throws Exception {
        mvc.perform(get("/shared-data/routes/sierra_huetor_points_within.gpx"))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void preflightFromFrontendIsAllowed() throws Exception {
        mvc.perform(options("/api/routes/check")
                .header("Origin", "https://park-tracker.vercel.app")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "authorization"))
           .andExpect(status().isOk())
           .andExpect(header().string("Access-Control-Allow-Origin", "https://park-tracker.vercel.app"));
    }

    @Test
    void preflightFromOtherOriginIsRejected() throws Exception {
        mvc.perform(options("/api/routes/check")
                .header("Origin", "https://evil.example.com")
                .header("Access-Control-Request-Method", "POST"))
           .andExpect(status().isForbidden());
    }

    @Test
    void invalidGpxReturnsBadRequest() throws Exception {
        Assumptions.assumeTrue(TEST_PYTHON != null, "PARKTRACKER_TEST_PYTHON no definido");
        mvc.perform(multipart("/api/routes/check").file(gpx("r.gpx", "no es xml")).with(jwt()))
           .andExpect(status().isBadRequest());
    }

    @Test
    void gpxWithXmlEntitiesIsRejected() throws Exception {
        Assumptions.assumeTrue(TEST_PYTHON != null, "PARKTRACKER_TEST_PYTHON no definido");
        String bomb = "<?xml version=\"1.0\"?><!DOCTYPE gpx [<!ENTITY a \"aaaaaaaaaa\"><!ENTITY b \"&a;&a;&a;&a;&a;\">]>"
                + "<gpx version=\"1.1\" creator=\"&b;\"><trk><trkseg><trkpt lat=\"37.25\" lon=\"-3.5\"/></trkseg></trk></gpx>";
        mvc.perform(multipart("/api/routes/check").file(gpx("r.gpx", bomb)).with(jwt()))
           .andExpect(status().isBadRequest());
    }

    @Test
    void routeThroughSierraHuetorIsDetected() throws Exception {
        Assumptions.assumeTrue(TEST_PYTHON != null, "PARKTRACKER_TEST_PYTHON no definido");
        // Línea oeste-este que cruza el parque a la altura de Huétor Santillán
        StringBuilder points = new StringBuilder();
        for (int i = 0; i <= 40; i++) {
            points.append(String.format(java.util.Locale.ROOT, "<trkpt lat=\"37.25\" lon=\"%.4f\"/>", -3.70 + i * 0.01));
        }
        String route = "<?xml version=\"1.0\"?><gpx version=\"1.1\" creator=\"test\" "
                + "xmlns=\"http://www.topografix.com/GPX/1/1\"><trk><trkseg>" + points + "</trkseg></trk></gpx>";

        mvc.perform(multipart("/api/routes/check").file(gpx("../../evil.gpx", route)).with(jwt()))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.parks", hasItem("sierra_huetor")))
           .andExpect(jsonPath("$.intersections.sierra_huetor.type").value("MultiLineString"));
    }
}

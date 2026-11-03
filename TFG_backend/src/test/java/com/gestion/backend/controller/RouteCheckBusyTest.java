package com.gestion.backend.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import com.gestion.backend.config.SecurityConfig;

/** Sin huecos libres para analizar, la petición se rechaza en vez de lanzar otro proceso de Python. */
@WebMvcTest(RouteCheckController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
    "auth0.domain=example.eu.auth0.com",
    "parktracker.max-concurrent-analyses=0"
})
class RouteCheckBusyTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void rejectsWhenAllAnalysisSlotsAreBusy() throws Exception {
        MockMultipartFile gpx = new MockMultipartFile("route", "r.gpx", "application/gpx+xml", "<gpx/>".getBytes());
        mvc.perform(multipart("/api/routes/check").file(gpx).with(jwt()))
           .andExpect(status().isServiceUnavailable())
           .andExpect(header().string("Retry-After", "10"));
    }
}

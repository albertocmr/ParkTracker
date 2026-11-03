package com.gestion.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.gestion.backend.config.SecurityConfig;
import com.gestion.backend.model.NaturalPark;
import com.gestion.backend.repository.NaturalParkRepository;

@WebMvcTest(NaturalParkController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
    "auth0.domain=example.eu.auth0.com",
    "auth0.audience=http://parkTracker-api"
})
class NaturalParkControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private NaturalParkRepository repository;

    private static MockHttpServletRequestBuilder createPark(String json) {
        return post("/api/natural_parks").contentType(MediaType.APPLICATION_JSON).content(json);
    }

    @Test
    void creatingRequiresAdminRole() throws Exception {
        mvc.perform(createPark("{\"name\":\"X\",\"province\":\"Y\",\"perimeterfile\":\"x\"}").with(jwt()))
           .andExpect(status().isForbidden());
        verify(repository, never()).save(any());
    }

    @Test
    void perimeterFileMustBeASafeIdentifier() throws Exception {
        mvc.perform(createPark("{\"name\":\"X\",\"province\":\"Y\",\"perimeterfile\":\"../../etc/passwd\"}")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
           .andExpect(status().isBadRequest());
        verify(repository, never()).save(any());
    }

    @Test
    void clientCannotChooseTheId() throws Exception {
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        mvc.perform(createPark("{\"id\":1,\"name\":\"Parque\",\"province\":\"Granada\",\"perimeterfile\":\"nuevo_parque\"}")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
           .andExpect(status().isOk());
        // id 0 => Hibernate inserta un registro nuevo en vez de sobrescribir el parque 1
        verify(repository).save(argThat((NaturalPark p) -> p.getId() == 0 && p.getPerimeterfile().equals("nuevo_parque")));
    }
}

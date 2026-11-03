package com.gestion.backend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Value("${auth0.domain:dev-01ujkdlvuv2fm5gp.eu.auth0.com}")
    private String auth0Domain;

    @Value("${auth0.audience:http://parkTracker-api}")
    private String auth0Audience;

    @Value("${parktracker.cors.allowed-origins:${CORS_ALLOWED_ORIGINS:https://parktracker.vercel.app,http://localhost:8001}}")
    private List<String> allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
          .csrf(csrf -> csrf.disable())
          // Usa el bean corsConfigurationSource; sin esto los preflight OPTIONS reciben 401
          .cors(Customizer.withDefaults())
          .authorizeHttpRequests(auth -> auth
              .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()

              // GET públicos
              .requestMatchers(HttpMethod.GET,
                  "/api/natural_parks",
                  "/api/natural_parks/*",
                  "/api/perimeters",
                  "/api/perimeters/**")
                .permitAll()

              // Solo ADMIN puede crear, editar o borrar
              .requestMatchers(HttpMethod.POST,
                  "/api/natural_parks",
                  "/api/natural_parks/**")
                .hasAuthority("ROLE_ADMIN")
              .requestMatchers(HttpMethod.PUT,
                  "/api/natural_parks",
                  "/api/natural_parks/**")
                .hasAuthority("ROLE_ADMIN")
              .requestMatchers(HttpMethod.DELETE,
                  "/api/natural_parks/**")
                .hasAuthority("ROLE_ADMIN")

              // Cualquier otra petición requiere autenticación
              .anyRequest()
                .authenticated()
          )
          .oauth2ResourceServer(oauth2 -> oauth2
              .jwt(jwt -> jwt
                  .decoder(jwtDecoder())
                  .jwtAuthenticationConverter(jwtAuthenticationConverter())
              )
          );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * Descarga el JWKS de Auth0 para validar la firma del token y comprueba
     * además el emisor (iss), la caducidad y que la audiencia (aud) sea esta API.
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        String issuer = "https://" + auth0Domain + "/";
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(issuer + ".well-known/jwks.json").build();

        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuer);
        OAuth2TokenValidator<Jwt> withAudience = jwt -> jwt.getAudience() != null && jwt.getAudience().contains(auth0Audience)
                ? OAuth2TokenValidatorResult.success()
                : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Audiencia no válida", null));

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withIssuer, withAudience));
        return decoder;
    }

    /**
     * Convierte el claim custom de roles en GrantedAuthority("ROLE_<ROL>").
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter rolesConverter = new JwtGrantedAuthoritiesConverter();
        rolesConverter.setAuthoritiesClaimName("https://parktracker.local/roles");
        rolesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(rolesConverter);
        return jwtConverter;
    }
}

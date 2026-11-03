package com.gestion.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Datos que un administrador puede enviar para crear o editar un parque.
 *
 * perimeterfile acaba en rutas del frontend (/parques-naturales/<perimeterfile> y el import
 * de su GeoJSON), por eso solo admite minúsculas, dígitos y guiones bajos.
 */
public record NaturalParkRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 50) String province,
        @NotBlank @Size(max = 60) @Pattern(regexp = "[a-z0-9_]+") String perimeterfile) {
}

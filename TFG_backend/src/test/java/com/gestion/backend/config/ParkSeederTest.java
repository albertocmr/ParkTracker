package com.gestion.backend.config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.gestion.backend.model.NaturalPark;
import com.gestion.backend.repository.NaturalParkRepository;

class ParkSeederTest {

    private final NaturalParkRepository repository = mock(NaturalParkRepository.class);
    private final ParkSeeder seeder = new ParkSeeder(repository);

    @Test
    void renamesSierraNorteInExistingDatabases() {
        NaturalPark park = new NaturalPark(7, "Sierra Norte de Sevilla", "Sevilla", "sierra_norte_sevilla");
        when(repository.count()).thenReturn(23L);
        when(repository.findByPerimeterfile("sierra_norte_sevilla")).thenReturn(Optional.of(park));

        seeder.run();

        assertEquals("Sierra Morena de Sevilla", park.getName());
        verify(repository).save(park);
    }

    @Test
    void keepsANameChangedByAnAdministrator() {
        NaturalPark park = new NaturalPark(7, "Sierra Morena (Sevilla)", "Sevilla", "sierra_norte_sevilla");
        when(repository.count()).thenReturn(23L);
        when(repository.findByPerimeterfile("sierra_norte_sevilla")).thenReturn(Optional.of(park));

        seeder.run();

        assertEquals("Sierra Morena (Sevilla)", park.getName());
        verify(repository, never()).save(any());
    }
}

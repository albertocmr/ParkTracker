package com.gestion.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestion.backend.exception.ResourceNotFoundException;
import com.gestion.backend.model.NaturalPark;
import com.gestion.backend.model.NaturalParkRequest;
import com.gestion.backend.repository.NaturalParkRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class NaturalParkController {

    @Autowired
    private NaturalParkRepository naturalParkRepository;

    @GetMapping("/natural_parks")
    public List<NaturalPark> listNaturalParks() {
        return naturalParkRepository.findAll();
    }

    // Se recibe un DTO validado y no la entidad: así el cliente no puede fijar el id
    // y sobrescribir otro parque, ni guardar valores arbitrarios en perimeterfile.
    // Si la validación falla, Spring responde 400.
    @PostMapping("/natural_parks")
    public ResponseEntity<NaturalPark> saveNaturalPark(@Valid @RequestBody NaturalParkRequest request) {
        NaturalPark park = new NaturalPark(0, request.name().trim(), request.province().trim(), request.perimeterfile());
        return ResponseEntity.ok(naturalParkRepository.save(park));
    }

    @GetMapping("/natural_parks/{id}")
    public ResponseEntity<NaturalPark> listNaturalParkById(@PathVariable Long id) {
        NaturalPark naturalPark = naturalParkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doesn't exist park with that ID : " + id));

        return ResponseEntity.ok(naturalPark);
    }

    @PutMapping("/natural_parks/{id}")
    public ResponseEntity<NaturalPark> updateNaturalPark(@PathVariable Long id, @Valid @RequestBody NaturalParkRequest request) {
        NaturalPark naturalPark = naturalParkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doesn't exist park with that ID : " + id));

        naturalPark.setName(request.name().trim());
        naturalPark.setProvince(request.province().trim());
        naturalPark.setPerimeterfile(request.perimeterfile());

        NaturalPark naturalParkUpdate = naturalParkRepository.save(naturalPark);

        return ResponseEntity.ok(naturalParkUpdate);
    }


    @DeleteMapping("/natural_parks/{id}")
    public ResponseEntity<Map<String,Boolean>> deletePark(@PathVariable Long id) {
        NaturalPark park = naturalParkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doesn't exist park with that ID : " + id));

        naturalParkRepository.delete(park);
        Map<String,Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}

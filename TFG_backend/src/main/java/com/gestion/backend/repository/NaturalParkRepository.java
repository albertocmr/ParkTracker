package com.gestion.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gestion.backend.model.NaturalPark;


@Repository
public interface NaturalParkRepository extends JpaRepository<NaturalPark, Long>{
    @Query("SELECT p.perimeterfile FROM NaturalPark p")
    List<String> getAllPerimeterFiles();

    Optional<NaturalPark> findByPerimeterfile(String perimeterfile);
}

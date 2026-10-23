package com.autorent.infrastructure.adapter.output.persistence.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.autorent.domain.model.EstadoAuto;
import com.autorent.infrastructure.adapter.output.persistence.entity.AutoEntity;

public interface AutoJpaRepository
        extends JpaRepository<AutoEntity, Long> {

    List<AutoEntity> findByEstado(EstadoAuto estado);

    Optional<AutoEntity> findByPlaca(String placa);
}
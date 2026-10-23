package com.autorent.infrastructure.adapter.output.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.autorent.infrastructure.adapter.output.persistence.entity.AlquilerEntity;
import com.autorent.domain.model.EstadoAlquiler;

import java.util.*;

public interface AlquilerJpaRepository
        extends JpaRepository<AlquilerEntity, Long> {

                List<AlquilerEntity> findByEstado(EstadoAlquiler estado);

}
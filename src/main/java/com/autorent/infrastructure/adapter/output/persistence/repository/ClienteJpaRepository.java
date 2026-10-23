package com.autorent.infrastructure.adapter.output.persistence.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.autorent.infrastructure.adapter.output.persistence.entity.ClienteEntity;

public interface ClienteJpaRepository
        extends JpaRepository<ClienteEntity, Long> {

    Optional<ClienteEntity> findByDocumento(String documento);

    Optional<ClienteEntity> findByTelefono(String telefono);
}
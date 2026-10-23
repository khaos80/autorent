package com.autorent.infrastructure.adapter.output.persistence.adapter;

import java.util.*;

import com.autorent.application.port.output.AlquilerRepositoryPort;
import com.autorent.domain.model.Alquiler;
import com.autorent.domain.model.EstadoAlquiler;
import com.autorent.infrastructure.adapter.output.persistence.entity.AlquilerEntity;
import com.autorent.infrastructure.adapter.output.persistence.repository.AlquilerJpaRepository;

public class AlquilerPersistenceAdapter
        implements AlquilerRepositoryPort {

    private final AlquilerJpaRepository alquilerJpaRepository;

    public AlquilerPersistenceAdapter(
            AlquilerJpaRepository alquilerJpaRepository) {

        this.alquilerJpaRepository = alquilerJpaRepository;
    }

    @Override
    public Alquiler guardar(Alquiler alquiler) {

        AlquilerEntity entity =
                mapToEntity(alquiler);

        AlquilerEntity saved =
                alquilerJpaRepository.save(entity);

        return mapToDomain(saved);
    }

    @Override
    public Optional<Alquiler> buscarPorId(Long id) {

        return alquilerJpaRepository
                .findById(id)
                .map(this::mapToDomain);
    }

    @Override
    public List<Alquiler> buscarTodos() {
        return alquilerJpaRepository.findAll()
                .stream()
                .map(this::mapToDomain)
                .toList();
    }

    @Override
    public List<Alquiler> buscarPorEstado(
        EstadoAlquiler estado) {

        return alquilerJpaRepository.findByEstado(estado)
                .stream()
                .map(this::mapToDomain)
                .toList();
    }

    private Alquiler mapToDomain(
            AlquilerEntity entity) {

        return new Alquiler(
                entity.getId(),
                entity.getClienteId(),
                entity.getAutoId(),
                entity.getFechaInicio(),
                entity.getFechaFin(),
                entity.getCantidadDias(),
                entity.getDiasUtilizados(),
                entity.getValorTotal(),
                entity.getValorPagado(),
                entity.getEstado()
        );
    }

    private AlquilerEntity mapToEntity(
            Alquiler alquiler) {

        AlquilerEntity entity =
                new AlquilerEntity();

        entity.setId(
                alquiler.getId()
        );
        entity.setClienteId(
                alquiler.getClienteId()
        );
        entity.setAutoId(
                alquiler.getAutoId()
        );
        entity.setFechaInicio(
                alquiler.getFechaInicio()
        );
        entity.setFechaFin(
                alquiler.getFechaFin()
        );
        entity.setCantidadDias(
                alquiler.getCantidadDias()
        );
        entity.setDiasUtilizados(
                alquiler.getDiasUtilizados()
        );
        entity.setValorTotal(
                alquiler.getValorTotal()
        );
        entity.setValorPagado(
                alquiler.getValorPagado()
        );
        entity.setEstado(
                alquiler.getEstado()
        );

        return entity;
    }
}
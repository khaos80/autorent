package com.autorent.infrastructure.adapter.output.persistence.adapter;

import java.util.List;
import java.util.Optional;

import com.autorent.application.port.output.AutoRepositoryPort;
import com.autorent.domain.model.Auto;
import com.autorent.domain.model.EstadoAuto;
import com.autorent.infrastructure.adapter.output.persistence.entity.AutoEntity;
import com.autorent.infrastructure.adapter.output.persistence.repository.AutoJpaRepository;

public class AutoPersistenceAdapter
        implements AutoRepositoryPort {

    private final AutoJpaRepository autoJpaRepository;

    public AutoPersistenceAdapter(
            AutoJpaRepository autoJpaRepository) {

        this.autoJpaRepository = autoJpaRepository;
    }

    @Override
    public Auto guardar(Auto auto) {

        AutoEntity entity = mapToEntity(auto);

        AutoEntity saved =
                autoJpaRepository.save(entity);

        return mapToDomain(saved);
    }

    @Override
    public Optional<Auto> buscarPorId(Long id) {

        return autoJpaRepository
                .findById(id)
                .map(this::mapToDomain);
    }

    @Override
    public Optional<Auto> buscarPorPlaca(String placa) {

        return autoJpaRepository
                .findByPlaca(placa)
                .map(this::mapToDomain);
    }

    @Override
    public List<Auto> buscarDisponibles() {

        return autoJpaRepository
                .findByEstado(EstadoAuto.DISPONIBLE)
                .stream()
                .map(this::mapToDomain)
                .toList();
    }

    @Override
    public List<Auto> buscarTodos() {

        return autoJpaRepository
                .findAll()
                .stream()
                .map(this::mapToDomain)
                .toList();
    }

    @Override
    public List<Auto> buscarPorEstado(EstadoAuto estado) {

        return autoJpaRepository
                .findByEstado(estado)
                .stream()
                .map(this::mapToDomain)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        autoJpaRepository.deleteById(id);
    }

    private Auto mapToDomain(
            AutoEntity entity) {

        return new Auto(
                entity.getId(),
                entity.getPlaca(),
                entity.getMarca(),
                entity.getModelo(),
                entity.getAnio(),
                entity.getPrecioPorDia(),
                entity.getEstado(),
                entity.getKilometraje()
        );
    }

    private AutoEntity mapToEntity(
            Auto auto) {

        AutoEntity entity =
                new AutoEntity();

        entity.setId(auto.getId());
        entity.setPlaca(auto.getPlaca());
        entity.setMarca(auto.getMarca());
        entity.setModelo(auto.getModelo());
        entity.setAnio(auto.getAnio());
        entity.setPrecioPorDia(
                auto.getPrecioPorDia()
        );
        entity.setEstado(auto.getEstado());
        entity.setKilometraje(
                auto.getKilometraje()
        );

        return entity;
    }
}
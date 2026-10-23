package com.autorent.infrastructure.adapter.output.persistence.adapter;

import java.util.*;

import com.autorent.application.port.output.ClienteRepositoryPort;
import com.autorent.domain.model.Cliente;
import com.autorent.infrastructure.adapter.output.persistence.entity.ClienteEntity;
import com.autorent.infrastructure.adapter.output.persistence.repository.ClienteJpaRepository;

public class ClientePersistenceAdapter
        implements ClienteRepositoryPort {

    private final ClienteJpaRepository clienteJpaRepository;

    public ClientePersistenceAdapter(
            ClienteJpaRepository clienteJpaRepository) {

        this.clienteJpaRepository = clienteJpaRepository;
    }

    @Override
    public Cliente guardar(Cliente cliente) {

        ClienteEntity entity = mapToEntity(cliente);

        ClienteEntity saved =
                clienteJpaRepository.save(entity);

        return mapToDomain(saved);
    }

    @Override
    public Optional<Cliente> buscarPorId(Long id) {

        return clienteJpaRepository
                .findById(id)
                .map(this::mapToDomain);
    }

    @Override
    public Optional<Cliente> buscarPorDocumento(
            String documento) {

        return clienteJpaRepository
                .findByDocumento(documento)
                .map(this::mapToDomain);
    }

    @Override
    public Optional<Cliente> buscarPorTelefono(
            String telefono) {

        return clienteJpaRepository
                .findByTelefono(telefono)
                .map(this::mapToDomain);
    }
    
    @Override
    public List<Cliente> buscarTodos() {
        return clienteJpaRepository
                .findAll()
                .stream()
                .map(this::mapToDomain)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        clienteJpaRepository.deleteById(id);
    }
    
    private Cliente mapToDomain(
            ClienteEntity entity) {

        return new Cliente(
                entity.getId(),
                entity.getNombre(),
                entity.getDocumento(),
                entity.getTelefono(),
                entity.getEmail()
        );
    }

    private ClienteEntity mapToEntity(
            Cliente cliente) {

        ClienteEntity entity =
                new ClienteEntity();

        entity.setId(cliente.getId());
        entity.setNombre(cliente.getNombre());
        entity.setDocumento(cliente.getDocumento());
        entity.setTelefono(cliente.getTelefono());
        entity.setEmail(cliente.getEmail());

        return entity;
    }
}
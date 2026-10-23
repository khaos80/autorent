package com.autorent.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.autorent.application.port.output.AlquilerRepositoryPort;
import com.autorent.application.port.output.AutoRepositoryPort;
import com.autorent.application.port.output.ClienteRepositoryPort;

import com.autorent.application.service.AlquilerService;
import com.autorent.application.service.AutoService;
import com.autorent.application.service.ClienteService;

import com.autorent.infrastructure.adapter.output.persistence.adapter.AlquilerPersistenceAdapter;
import com.autorent.infrastructure.adapter.output.persistence.adapter.AutoPersistenceAdapter;
import com.autorent.infrastructure.adapter.output.persistence.adapter.ClientePersistenceAdapter;

import com.autorent.infrastructure.adapter.output.persistence.repository.AlquilerJpaRepository;
import com.autorent.infrastructure.adapter.output.persistence.repository.AutoJpaRepository;
import com.autorent.infrastructure.adapter.output.persistence.repository.ClienteJpaRepository;

@Configuration
public class BeanConfiguration {

    @Bean
    public AutoRepositoryPort autoRepositoryPort(
            AutoJpaRepository autoJpaRepository) {

        return new AutoPersistenceAdapter(
                autoJpaRepository
        );
    }

    @Bean
    public ClienteRepositoryPort clienteRepositoryPort(
            ClienteJpaRepository clienteJpaRepository) {

        return new ClientePersistenceAdapter(
                clienteJpaRepository
        );
    }

    @Bean
    public AlquilerRepositoryPort alquilerRepositoryPort(
            AlquilerJpaRepository alquilerJpaRepository) {

        return new AlquilerPersistenceAdapter(
                alquilerJpaRepository
        );
    }

    @Bean
    public AutoService autoService(
            AutoRepositoryPort autoRepositoryPort) {

        return new AutoService(
                autoRepositoryPort
        );
    }

    @Bean
    public ClienteService clienteService(
            ClienteRepositoryPort clienteRepositoryPort,
            AlquilerRepositoryPort alquilerRepositoryPort) {

        return new ClienteService(
                clienteRepositoryPort,
                alquilerRepositoryPort
        );
    }

    @Bean
    public AlquilerService alquilerService(
            AutoRepositoryPort autoRepositoryPort,
            ClienteRepositoryPort clienteRepositoryPort,
            AlquilerRepositoryPort alquilerRepositoryPort) {

        return new AlquilerService(
                autoRepositoryPort,
                clienteRepositoryPort,
                alquilerRepositoryPort
        );
    }
}
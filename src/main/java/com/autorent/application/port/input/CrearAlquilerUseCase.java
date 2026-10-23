package com.autorent.application.port.input;

import com.autorent.domain.model.Alquiler;

public interface CrearAlquilerUseCase {

    Alquiler crear(
            Long clienteId,
            Long autoId,
            Integer cantidadDias
    );

}
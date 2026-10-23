package com.autorent.application.port.input;

import com.autorent.domain.model.Alquiler;
import com.autorent.domain.model.EstadoAlquiler;

import java.util.List;

public interface ConsultarAlquileresPorEstadoUseCase {

    List<Alquiler> consultarPorEstado(
            EstadoAlquiler estado
    );

}
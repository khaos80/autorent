package com.autorent.application.port.input;

import com.autorent.domain.model.Auto;
import com.autorent.domain.model.EstadoAuto;

import java.util.List;

public interface ConsultarAutosPorEstadoUseCase {

    List<Auto> consultarPorEstado(
            EstadoAuto estado
    );
}
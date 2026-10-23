package com.autorent.application.port.input;

import com.autorent.domain.model.Alquiler;

public interface ConsultarAlquilerUseCase {

    Alquiler consultarPorId(Long id);

}
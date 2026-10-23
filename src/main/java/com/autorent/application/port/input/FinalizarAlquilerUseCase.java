package com.autorent.application.port.input;

import com.autorent.domain.model.Alquiler;

public interface FinalizarAlquilerUseCase {

    Alquiler finalizar(Long alquilerId);

}
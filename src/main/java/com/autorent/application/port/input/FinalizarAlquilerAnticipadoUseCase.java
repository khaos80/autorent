package com.autorent.application.port.input;

import com.autorent.domain.model.Alquiler;

public interface FinalizarAlquilerAnticipadoUseCase {

    Alquiler finalizarAnticipado(
            Long alquilerId,
            Integer diasUtilizados
    );
}
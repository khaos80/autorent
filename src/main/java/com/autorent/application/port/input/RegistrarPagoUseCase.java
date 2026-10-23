package com.autorent.application.port.input;

import com.autorent.domain.model.Alquiler;

public interface RegistrarPagoUseCase {

    Alquiler registrarPago(
            Long alquilerId,
            Double valorPago
    );
}
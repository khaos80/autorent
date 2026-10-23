package com.autorent.application.port.input;

import com.autorent.domain.model.Cliente;

public interface ActualizarClienteUseCase {

    Cliente actualizar(
            Long id,
            Cliente cliente
    );

}
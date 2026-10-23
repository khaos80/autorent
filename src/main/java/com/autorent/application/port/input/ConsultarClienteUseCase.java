package com.autorent.application.port.input;

import com.autorent.domain.model.Cliente;

public interface ConsultarClienteUseCase {

    Cliente consultarPorId(Long id);

}
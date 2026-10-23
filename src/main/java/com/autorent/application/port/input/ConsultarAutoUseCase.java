package com.autorent.application.port.input;

import com.autorent.domain.model.Auto;

public interface ConsultarAutoUseCase {

    Auto consultarPorId(Long id);

}
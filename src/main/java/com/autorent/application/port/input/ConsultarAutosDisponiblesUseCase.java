package com.autorent.application.port.input;

import com.autorent.domain.model.Auto;

import java.util.List;

public interface ConsultarAutosDisponiblesUseCase {

    List<Auto> consultarDisponibles();

}
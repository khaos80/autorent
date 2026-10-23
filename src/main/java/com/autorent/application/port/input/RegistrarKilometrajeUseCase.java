package com.autorent.application.port.input;

public interface RegistrarKilometrajeUseCase {

    void registrarKilometraje(
            Long autoId,
            Integer kilometros
    );

}
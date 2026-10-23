package com.autorent.domain.exception;

public class AlquilerFinalizadoException extends RuntimeException {

    public AlquilerFinalizadoException(String mensaje) {
        super(mensaje);
    }

}
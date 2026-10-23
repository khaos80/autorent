package com.autorent.domain.exception;

public class AlquilerNoEncontradoException extends RuntimeException {

    public AlquilerNoEncontradoException(String mensaje) {
        super(mensaje);
    }

}
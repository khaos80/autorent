package com.autorent.domain.exception;

public class TelefonoDuplicadoException
        extends RuntimeException {

    public TelefonoDuplicadoException(
            String mensaje) {

        super(mensaje);
    }
}
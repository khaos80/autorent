package com.autorent.domain.exception;

public class AutoDuplicadoException
        extends RuntimeException {

    public AutoDuplicadoException(
            String mensaje) {

        super(mensaje);
    }
}
package com.autorent.domain.exception;

public class AutoNoEliminableException
        extends RuntimeException {

    public AutoNoEliminableException(
            String mensaje) {

        super(mensaje);
    }
}
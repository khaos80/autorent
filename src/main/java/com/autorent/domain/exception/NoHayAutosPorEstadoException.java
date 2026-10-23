package com.autorent.domain.exception;

public class NoHayAutosPorEstadoException
        extends RuntimeException {

    public NoHayAutosPorEstadoException(
            String mensaje) {

        super(mensaje);
    }
}
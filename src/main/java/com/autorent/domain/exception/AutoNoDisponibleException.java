package com.autorent.domain.exception;

public class AutoNoDisponibleException extends RuntimeException {

    public AutoNoDisponibleException(String mensaje) {
        super(mensaje);
    }

}
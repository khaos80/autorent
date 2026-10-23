package com.autorent.domain.exception;

public class DatosInvalidosException extends RuntimeException {

    public DatosInvalidosException(String mensaje) {
        super(mensaje);
    }

}
package com.autorent.domain.exception;

public class ClienteNoEncontradoException extends RuntimeException {

    public ClienteNoEncontradoException(String mensaje) {
        super(mensaje);
    }

}
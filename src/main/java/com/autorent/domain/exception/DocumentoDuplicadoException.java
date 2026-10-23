package com.autorent.domain.exception;

public class DocumentoDuplicadoException extends RuntimeException {

    public DocumentoDuplicadoException(String mensaje) {
        super(mensaje);
    }

}
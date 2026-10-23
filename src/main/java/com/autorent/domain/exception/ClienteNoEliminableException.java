package com.autorent.domain.exception;

public class ClienteNoEliminableException
        extends RuntimeException {

    public ClienteNoEliminableException(
            String mensaje){

        super(mensaje);
    }

}
package com.autorent.infrastructure.adapter.input.rest.exception;

import com.autorent.domain.exception.AlquilerFinalizadoException;
import com.autorent.domain.exception.AlquilerNoEncontradoException;
import com.autorent.domain.exception.AutoNoDisponibleException;
import com.autorent.domain.exception.AutoNoEncontradoException;
import com.autorent.domain.exception.ClienteNoEncontradoException;
import com.autorent.domain.exception.DatosInvalidosException;
import com.autorent.domain.exception.DocumentoDuplicadoException;
import com.autorent.domain.exception.NoHayAutosPorEstadoException;
import com.autorent.domain.exception.PagoPendienteException;
import com.autorent.domain.exception.AutoDuplicadoException;
import com.autorent.domain.exception.TelefonoDuplicadoException;
import com.autorent.domain.exception.AutoNoEliminableException;
import com.autorent.domain.exception.ClienteNoEliminableException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            AutoNoEncontradoException.class,
            ClienteNoEncontradoException.class,
            AlquilerNoEncontradoException.class
    })
    public ResponseEntity<String> manejarNoEncontrado(
            RuntimeException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler({
            AutoNoDisponibleException.class,
            DocumentoDuplicadoException.class,
            AlquilerFinalizadoException.class,
            PagoPendienteException.class,
            AutoDuplicadoException.class,
            TelefonoDuplicadoException.class,
            AutoNoEliminableException.class,
            ClienteNoEliminableException.class
    })
    public ResponseEntity<String> manejarConflicto(
            RuntimeException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }

    @ExceptionHandler(
            DatosInvalidosException.class
    )
    public ResponseEntity<String> manejarBadRequest(
            DatosInvalidosException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(
            NoHayAutosPorEstadoException.class
    )
    public ResponseEntity<String> manejarSinResultados(
            NoHayAutosPorEstadoException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> manejarGeneral(
            Exception ex) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
    }
}
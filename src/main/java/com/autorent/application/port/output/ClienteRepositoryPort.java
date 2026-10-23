package com.autorent.application.port.output;

import com.autorent.domain.model.Cliente;

import java.util.*;

public interface ClienteRepositoryPort {

    Cliente guardar(Cliente cliente);

    Optional<Cliente> buscarPorId(Long id);

    Optional<Cliente> buscarPorDocumento(String documento);

    List<Cliente> buscarTodos();

    void eliminar(Long id);

    Optional<Cliente> buscarPorTelefono(String telefono);

}
package com.autorent.application.service;

import java.util.*;

import com.autorent.application.port.input.ConsultarClienteUseCase;
import com.autorent.application.port.input.ConsultarTodosClientesUseCase;
import com.autorent.application.port.input.EliminarClienteUseCase;
import com.autorent.application.port.input.RegistrarClienteUseCase;
import com.autorent.application.port.input.ActualizarClienteUseCase;
import com.autorent.application.port.output.ClienteRepositoryPort;
import com.autorent.application.port.output.AlquilerRepositoryPort;
import static com.autorent.domain.constants.ErrorMessages.*;
import com.autorent.domain.exception.ClienteNoEncontradoException;
import com.autorent.domain.exception.DatosInvalidosException;
import com.autorent.domain.exception.DocumentoDuplicadoException;
import com.autorent.domain.exception.TelefonoDuplicadoException;
import com.autorent.domain.exception.ClienteNoEliminableException;
import com.autorent.domain.model.Cliente;
import com.autorent.domain.model.EstadoAlquiler;

public class ClienteService implements
        RegistrarClienteUseCase,
        ConsultarClienteUseCase,
        ConsultarTodosClientesUseCase,
        ActualizarClienteUseCase,
        EliminarClienteUseCase {

    private final ClienteRepositoryPort clienteRepositoryPort;
    private final AlquilerRepositoryPort alquilerRepositoryPort;

    public ClienteService(
        ClienteRepositoryPort clienteRepositoryPort,
        AlquilerRepositoryPort alquilerRepositoryPort
        ) {
                
                this.clienteRepositoryPort = clienteRepositoryPort;
                this.alquilerRepositoryPort = alquilerRepositoryPort;
    }

    private void validarCliente(Cliente cliente) {
        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
                
                throw new DatosInvalidosException(NOMBRE_OBLIGATORIO);
        }

        if (cliente.getDocumento() == null || cliente.getDocumento().isBlank()) {
                
                throw new DatosInvalidosException(DOCUMENTO_OBLIGATORIO);
        }

        if (!cliente.getDocumento().matches("\\d{5,10}")) {
            
            throw new DatosInvalidosException(DOCUMENTO_INVALIDO);
        }

        if (cliente.getTelefono() == null || cliente.getTelefono().isBlank()) {
                
                throw new DatosInvalidosException(TELEFONO_OBLIGATORIO);
        }

        if (!cliente.getTelefono().matches("^3[0-9]{9}$")) {
                
                throw new DatosInvalidosException(TELEFONO_INVALIDO);
        }

        if (cliente.getEmail() == null || cliente.getEmail().isBlank()) {
                
                throw new DatosInvalidosException(EMAIL_OBLIGATORIO);
        }

        if (cliente.getEmail() == null || !cliente.getEmail().contains("@")) {
                
                throw new DatosInvalidosException(EMAIL_INVALIDO);
        }
    }

    @Override
    public Cliente registrar(Cliente cliente) {

        validarCliente(cliente);

        clienteRepositoryPort.buscarPorDocumento(cliente.getDocumento()).ifPresent(clienteExistente -> {
                
                throw new DocumentoDuplicadoException(DOCUMENTO_DUPLICADO);
        });

        clienteRepositoryPort.buscarPorTelefono(cliente.getTelefono()).ifPresent(clienteExistente -> {
                
                throw new TelefonoDuplicadoException(TELEFONO_DUPLICADO);
        });
        
        return clienteRepositoryPort.guardar(cliente);
    }

    @Override
    public Cliente consultarPorId(Long id) {
        
        return clienteRepositoryPort.buscarPorId(id).orElseThrow(() ->
        new ClienteNoEncontradoException(CLIENTE_NO_ENCONTRADO));
    }

    @Override
    public List<Cliente> consultarTodos() {
        
        List<Cliente> clientes = clienteRepositoryPort.buscarTodos();
        
        if (clientes.isEmpty()) {
                
                throw new ClienteNoEncontradoException(NO_HAY_CLIENTES_REGISTRADOS);
        }
        return clientes;
    }

    @Override
    public Cliente actualizar(Long id, Cliente clienteActualizado) {
        
        Cliente cliente = clienteRepositoryPort.buscarPorId(id).orElseThrow(() ->
        new ClienteNoEncontradoException(CLIENTE_NO_ENCONTRADO));
        
        validarCliente(clienteActualizado);

        clienteRepositoryPort.buscarPorDocumento(
                clienteActualizado.getDocumento()).ifPresent(clienteExistente -> {
                        
                        if(!clienteExistente.getId().equals(id)) {
                                throw new DocumentoDuplicadoException(DOCUMENTO_DUPLICADO);
                        }
                });

        clienteRepositoryPort.buscarPorTelefono(
                clienteActualizado.getTelefono()).ifPresent(clienteExistente -> {

                        if(!clienteExistente.getId().equals(id)) {
                                throw new TelefonoDuplicadoException(TELEFONO_DUPLICADO);
                        }
                });

        cliente.setNombre(clienteActualizado.getNombre());

        cliente.setTelefono(clienteActualizado.getTelefono());

        cliente.setDocumento(clienteActualizado.getDocumento());

        cliente.setEmail(clienteActualizado.getEmail());

        return clienteRepositoryPort.guardar(cliente);
        }

    @Override
    public void eliminar(Long id) {
        Cliente cliente = clienteRepositoryPort.buscarPorId(id).orElseThrow(() ->
        new ClienteNoEncontradoException(CLIENTE_NO_ENCONTRADO));
        
        boolean tieneAlquilerActivo =
        alquilerRepositoryPort.buscarTodos().stream().anyMatch(alquiler ->
                
                alquiler.getClienteId().equals(id) && alquiler.getEstado() == EstadoAlquiler.ACTIVO);
                
                if(tieneAlquilerActivo){

                        throw new ClienteNoEliminableException(CLIENTE_NO_ELIMINABLE);
                }

        clienteRepositoryPort.eliminar(cliente.getId());
    }
}
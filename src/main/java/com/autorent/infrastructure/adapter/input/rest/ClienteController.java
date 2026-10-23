package com.autorent.infrastructure.adapter.input.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autorent.application.port.input.ConsultarClienteUseCase;
import com.autorent.application.port.input.ConsultarTodosClientesUseCase;
import com.autorent.application.port.input.RegistrarClienteUseCase;
import com.autorent.application.port.input.EliminarClienteUseCase;
import com.autorent.application.port.input.ActualizarClienteUseCase;
import com.autorent.domain.model.Cliente;

import static com.autorent.domain.constants.SuccessMessages.CLIENTE_ELIMINADO;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final RegistrarClienteUseCase registrarClienteUseCase;
    private final ConsultarClienteUseCase consultarClienteUseCase;
    private final ConsultarTodosClientesUseCase consultarTodosClientesUseCase;
    private final EliminarClienteUseCase eliminarClienteUseCase;
    private final ActualizarClienteUseCase actualizarClienteUseCase;
    public ClienteController(
            RegistrarClienteUseCase registrarClienteUseCase,
            ConsultarClienteUseCase consultarClienteUseCase,
            ConsultarTodosClientesUseCase consultarTodosClientesUseCase,
            EliminarClienteUseCase eliminarClienteUseCase,
            ActualizarClienteUseCase actualizarClienteUseCase) {

        this.registrarClienteUseCase = registrarClienteUseCase;
        this.consultarClienteUseCase = consultarClienteUseCase;
        this.consultarTodosClientesUseCase = consultarTodosClientesUseCase;
        this.eliminarClienteUseCase = eliminarClienteUseCase;
        this.actualizarClienteUseCase = actualizarClienteUseCase;
    }

    @PostMapping
    public ResponseEntity<Cliente> crearCliente(
            @RequestBody Cliente cliente) {

        return ResponseEntity.ok(
                registrarClienteUseCase.registrar(cliente)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> consultarCliente(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                consultarClienteUseCase.consultarPorId(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> consultarTodosClientes() {

        return ResponseEntity.ok(
                consultarTodosClientesUseCase.consultarTodos()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(
        @PathVariable Long id,
        @RequestBody Cliente cliente){
            
            return ResponseEntity.ok(actualizarClienteUseCase.actualizar(
                id,
                cliente
            )
        );
    }

    @DeleteMapping ("/{id}")
    public ResponseEntity<String> eliminarCliente(
            @PathVariable Long id) {

        eliminarClienteUseCase.eliminar(id);
        return ResponseEntity.ok(CLIENTE_ELIMINADO);
    }    
}
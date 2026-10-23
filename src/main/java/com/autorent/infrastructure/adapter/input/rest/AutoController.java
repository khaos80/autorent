package com.autorent.infrastructure.adapter.input.rest;

import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.autorent.application.port.input.ConsultarAutoUseCase;
import com.autorent.application.port.input.ConsultarAutosDisponiblesUseCase;
import com.autorent.application.port.input.RegistrarAutoUseCase;
import com.autorent.application.port.input.ConsultarAutosPorEstadoUseCase;
import com.autorent.application.port.input.ConsultarTodosAutosUseCase;
import com.autorent.application.port.input.EliminarAutoUseCase;
import com.autorent.application.port.input.RegistrarKilometrajeUseCase;
import com.autorent.application.port.input.EnviarAutoATallerUseCase;
import com.autorent.application.port.input.HabilitarAutoUseCase;
import com.autorent.domain.model.Auto;
import com.autorent.domain.model.EstadoAuto;

import com.autorent.infrastructure.adapter.input.rest.dto.RegistrarKilometrajeRequest;

import static com.autorent.domain.constants.SuccessMessages.AUTO_ELIMINADO;

@RestController
@RequestMapping("/api/autos")
public class AutoController {

    private final RegistrarAutoUseCase registrarAutoUseCase;
    private final ConsultarAutoUseCase consultarAutoUseCase;
    private final ConsultarAutosDisponiblesUseCase consultarAutosDisponiblesUseCase;
    private final ConsultarAutosPorEstadoUseCase consultarAutosPorEstadoUseCase;
    private final ConsultarTodosAutosUseCase consultarTodosAutosUseCase;
    private final EliminarAutoUseCase eliminarAutoUseCase;
    private final RegistrarKilometrajeUseCase registrarKilometrajeUseCase;
    private final EnviarAutoATallerUseCase enviarAutoATallerUseCase;
    private final HabilitarAutoUseCase habilitarAutoUseCase;

    public AutoController(
            RegistrarAutoUseCase registrarAutoUseCase,
            ConsultarAutoUseCase consultarAutoUseCase,
            ConsultarAutosDisponiblesUseCase consultarAutosDisponiblesUseCase,
            ConsultarAutosPorEstadoUseCase consultarAutosPorEstadoUseCase,
            ConsultarTodosAutosUseCase consultarTodosAutosUseCase,
            EliminarAutoUseCase eliminarAutoUseCase,
            RegistrarKilometrajeUseCase registrarKilometrajeUseCase,
            EnviarAutoATallerUseCase enviarAutoATallerUseCase,
            HabilitarAutoUseCase habilitarAutoUseCase) {

        this.registrarAutoUseCase = registrarAutoUseCase;
        this.consultarAutoUseCase = consultarAutoUseCase;
        this.consultarAutosDisponiblesUseCase = consultarAutosDisponiblesUseCase;
        this.consultarAutosPorEstadoUseCase = consultarAutosPorEstadoUseCase;
        this.consultarTodosAutosUseCase = consultarTodosAutosUseCase;
        this.eliminarAutoUseCase = eliminarAutoUseCase;
        this.registrarKilometrajeUseCase = registrarKilometrajeUseCase;
        this.enviarAutoATallerUseCase = enviarAutoATallerUseCase;
        this.habilitarAutoUseCase = habilitarAutoUseCase;  
    }

    @PostMapping
    public ResponseEntity<Auto> crearAuto(
            @RequestBody Auto auto) {

        return ResponseEntity.ok(
                registrarAutoUseCase.registrar(auto)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auto> consultarAuto(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                consultarAutoUseCase.consultarPorId(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<Auto>> consultarTodos() {

        return ResponseEntity.ok(
                consultarTodosAutosUseCase.consultarTodos()
        );
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Auto>> consultarDisponibles() {

        return ResponseEntity.ok(
                consultarAutosDisponiblesUseCase.consultarDisponibles()
        );
    }

    @GetMapping("/alquilados")
    public ResponseEntity<List<Auto>> consultarAlquilados() {

        return ResponseEntity.ok(
                consultarAutosPorEstadoUseCase.consultarPorEstado(EstadoAuto.ALQUILADO)
        );
    }

    @GetMapping("/mantenimiento")
    public ResponseEntity<List<Auto>> consultarMantenimiento() {

        return ResponseEntity.ok(
                consultarAutosPorEstadoUseCase.consultarPorEstado(EstadoAuto.MANTENIMIENTO)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarAuto(@PathVariable Long id) {
        eliminarAutoUseCase.eliminar(id);

        return ResponseEntity.ok(AUTO_ELIMINADO);
    }

    @PutMapping("/{id}/kilometraje")
    public ResponseEntity<String> registrarKilometraje(
        @PathVariable Long id,
        @RequestBody RegistrarKilometrajeRequest request){
            
            registrarKilometrajeUseCase.registrarKilometraje(id, request.getKilometros());
            
            return ResponseEntity.ok("Kilometraje actualizado correctamente");
        }

    @PutMapping("/{id}/mantenimiento")
    public ResponseEntity<String> enviarATaller(
        @PathVariable Long id){
                        
            enviarAutoATallerUseCase.enviarATaller(id);
            
            return ResponseEntity.ok("Vehículo enviado a mantenimiento");
        }

    @PutMapping("/{id}/habilitar")
    public ResponseEntity<String> habilitarVehiculo(
        @PathVariable Long id){
            
            habilitarAutoUseCase.habilitar(id);
            
            return ResponseEntity.ok("Vehículo habilitado nuevamente");
        }     
}
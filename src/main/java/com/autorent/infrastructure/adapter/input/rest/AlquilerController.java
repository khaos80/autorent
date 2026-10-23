package com.autorent.infrastructure.adapter.input.rest;

import com.autorent.application.port.input.CrearAlquilerUseCase;
import com.autorent.application.port.input.ConsultarAlquilerUseCase;
import com.autorent.application.port.input.RegistrarPagoUseCase;
import com.autorent.application.port.input.FinalizarAlquilerUseCase;
import com.autorent.application.port.input.FinalizarAlquilerAnticipadoUseCase;
import com.autorent.application.port.input.ConsultarTodosAlquileresUseCase;
import com.autorent.application.port.input.ConsultarAlquileresPorEstadoUseCase;
import com.autorent.domain.model.EstadoAlquiler;
import com.autorent.domain.model.Alquiler;
import com.autorent.infrastructure.adapter.input.rest.dto.CreateAlquilerRequest;
import com.autorent.infrastructure.adapter.input.rest.dto.RegistrarPagoRequest;
import com.autorent.infrastructure.adapter.input.rest.dto.FinalizarAnticipadoRequest;

import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alquileres")
public class AlquilerController {
        private final CrearAlquilerUseCase crearAlquilerUseCase;
        private final ConsultarAlquilerUseCase consultarAlquilerUseCase;
        private final FinalizarAlquilerUseCase finalizarAlquilerUseCase;
        private final RegistrarPagoUseCase registrarPagoUseCase;
        private final ConsultarTodosAlquileresUseCase consultarTodosAlquileresUseCase;
        private final ConsultarAlquileresPorEstadoUseCase consultarAlquileresPorEstadoUseCase;
        private final FinalizarAlquilerAnticipadoUseCase finalizarAlquilerAnticipadoUseCase;
        
        public AlquilerController(
                CrearAlquilerUseCase crearAlquilerUseCase,
                ConsultarAlquilerUseCase consultarAlquilerUseCase,
                FinalizarAlquilerUseCase finalizarAlquilerUseCase,
                RegistrarPagoUseCase registrarPagoUseCase,
                ConsultarTodosAlquileresUseCase consultarTodosAlquileresUseCase,
                ConsultarAlquileresPorEstadoUseCase consultarAlquileresPorEstadoUseCase,
                FinalizarAlquilerAnticipadoUseCase finalizarAlquilerAnticipadoUseCase) {
                        this.crearAlquilerUseCase = crearAlquilerUseCase;
                        this.consultarAlquilerUseCase = consultarAlquilerUseCase;
                        this.finalizarAlquilerUseCase = finalizarAlquilerUseCase;
                        this.registrarPagoUseCase = registrarPagoUseCase;
                        this.consultarTodosAlquileresUseCase = consultarTodosAlquileresUseCase;
                        this.consultarAlquileresPorEstadoUseCase = consultarAlquileresPorEstadoUseCase;
                        this.finalizarAlquilerAnticipadoUseCase = finalizarAlquilerAnticipadoUseCase;
                }

        @PostMapping
        public ResponseEntity<Alquiler> crearAlquiler(
                @RequestBody CreateAlquilerRequest request) {
                        return ResponseEntity.ok(
                                crearAlquilerUseCase.crear(
                                        request.getClienteId(),
                                        request.getAutoId(),
                                        request.getCantidadDias()
                                )
                        );
                }

        @GetMapping("/{id}")
        public ResponseEntity<Alquiler> consultarAlquiler(
                @PathVariable Long id) {
                        
                        return ResponseEntity.ok(
                                consultarAlquilerUseCase.consultarPorId(id)
                        );
                }

        @GetMapping
        public ResponseEntity<List<Alquiler>> consultarTodos() {
                        return ResponseEntity.ok(
                                consultarTodosAlquileresUseCase.consultarTodos()
                        );
                }

        @GetMapping("/activos")
        public ResponseEntity<List<Alquiler>> consultarActivos() {
                        return ResponseEntity.ok(
                                consultarAlquileresPorEstadoUseCase.consultarPorEstado(EstadoAlquiler.ACTIVO)
                        );
                }

        @GetMapping("/finalizados")
        public ResponseEntity<List<Alquiler>> consultarFinalizados() {
                        return ResponseEntity.ok(
                                consultarAlquileresPorEstadoUseCase.consultarPorEstado(EstadoAlquiler.FINALIZADO)
                        );
                }

        @PutMapping("/{id}/pagar")
        public ResponseEntity<Alquiler> registrarPago(
                @PathVariable Long id,
                @RequestBody RegistrarPagoRequest request) {
                
                        return ResponseEntity.ok(
                                registrarPagoUseCase.registrarPago(id, request.getValorPago())
                        );
                }

        @PutMapping("/{id}/finalizar")
        public ResponseEntity<Alquiler> finalizarAlquiler(
                @PathVariable Long id) {
                        
                        return ResponseEntity.ok(
                                finalizarAlquilerUseCase.finalizar(id)
                        );
                }

        @PutMapping("/{id}/finalizar-anticipado")
        public ResponseEntity<Alquiler> finalizarAnticipado(
                @PathVariable Long id,
                @RequestBody FinalizarAnticipadoRequest request) {

                        return ResponseEntity.ok(
                                finalizarAlquilerAnticipadoUseCase.finalizarAnticipado(id, request.getDiasUtilizados())
                        );
                }
           
}
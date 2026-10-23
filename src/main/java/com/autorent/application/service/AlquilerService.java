package com.autorent.application.service;

import java.time.LocalDate;
import java.util.List;
import java.text.DecimalFormat;

import com.autorent.application.port.input.ConsultarAlquilerUseCase;
import com.autorent.application.port.input.ConsultarAlquileresPorEstadoUseCase;
import com.autorent.application.port.input.ConsultarTodosAlquileresUseCase;
import com.autorent.application.port.input.CrearAlquilerUseCase;
import com.autorent.application.port.input.FinalizarAlquilerAnticipadoUseCase;
import com.autorent.application.port.input.FinalizarAlquilerUseCase;
import com.autorent.application.port.input.RegistrarPagoUseCase;
import com.autorent.application.port.output.AlquilerRepositoryPort;
import com.autorent.application.port.output.AutoRepositoryPort;
import com.autorent.application.port.output.ClienteRepositoryPort;
import static com.autorent.domain.constants.ErrorMessages.*;
import com.autorent.domain.exception.AlquilerNoEncontradoException;
import com.autorent.domain.exception.AlquilerFinalizadoException;
import com.autorent.domain.exception.AutoNoDisponibleException;
import com.autorent.domain.exception.AutoNoEncontradoException;
import com.autorent.domain.exception.ClienteNoEncontradoException;
import com.autorent.domain.exception.DatosInvalidosException;
import com.autorent.domain.exception.PagoPendienteException;
import com.autorent.domain.model.Alquiler;
import com.autorent.domain.model.Auto;
import com.autorent.domain.model.EstadoAlquiler;
import com.autorent.domain.model.EstadoAuto;


public class AlquilerService implements
        CrearAlquilerUseCase,
        ConsultarAlquilerUseCase,
        FinalizarAlquilerUseCase,
        RegistrarPagoUseCase,
        ConsultarTodosAlquileresUseCase,
        ConsultarAlquileresPorEstadoUseCase,
        FinalizarAlquilerAnticipadoUseCase {

        private final AutoRepositoryPort autoRepositoryPort;
        private final ClienteRepositoryPort clienteRepositoryPort;
        private final AlquilerRepositoryPort alquilerRepositoryPort;

        private static final Integer KILOMETROS_POR_DIA = 100;

        private String formatearDinero(Double valor) {

                DecimalFormat formato = new DecimalFormat("#,###");

                return formato.format(valor);
        }

        public AlquilerService(
                AutoRepositoryPort autoRepositoryPort,
                ClienteRepositoryPort clienteRepositoryPort,
                AlquilerRepositoryPort alquilerRepositoryPort) {

                this.autoRepositoryPort = autoRepositoryPort;
                this.clienteRepositoryPort = clienteRepositoryPort;
                this.alquilerRepositoryPort = alquilerRepositoryPort;
        }

        @Override
        public Alquiler crear(
            Long clienteId,
            Long autoId,
            Integer cantidadDias) {
                
                if (cantidadDias == null || cantidadDias <= 0) {
                        
                        throw new DatosInvalidosException(DIAS_INVALIDOS);
                }
                
                clienteRepositoryPort.buscarPorId(clienteId).orElseThrow(() ->
                new ClienteNoEncontradoException(CLIENTE_NO_ENCONTRADO));
                
                Auto auto =
                
                autoRepositoryPort.buscarPorId(autoId).orElseThrow(() ->
                new AutoNoEncontradoException(AUTO_NO_ENCONTRADO));
                
                if (auto.getEstado() != EstadoAuto.DISPONIBLE) {
                        throw new AutoNoDisponibleException(AUTO_NO_DISPONIBLE);
                }
                
                double valorTotal = auto.getPrecioPorDia() * cantidadDias;

                Alquiler alquiler = new Alquiler();

                alquiler.setClienteId(clienteId);
                alquiler.setAutoId(autoId);

                alquiler.setCantidadDias(cantidadDias);

                alquiler.setFechaInicio(LocalDate.now());

                alquiler.setFechaFin(LocalDate.now().plusDays(cantidadDias));

                alquiler.setValorTotal(valorTotal);

                alquiler.setValorPagado(0.0);

                alquiler.setEstado(EstadoAlquiler.ACTIVO);

                auto.setEstado(EstadoAuto.ALQUILADO);

                auto.setKilometraje(0);

                autoRepositoryPort.guardar(auto);

                return alquilerRepositoryPort.guardar(alquiler);
        }

        @Override
        public Alquiler consultarPorId(Long id) {
                
                return alquilerRepositoryPort.buscarPorId(id).orElseThrow(() ->
                new AlquilerNoEncontradoException(ALQUILER_NO_ENCONTRADO));
        }

        @Override
        public List<Alquiler> consultarTodos() {
                List<Alquiler> alquileres = alquilerRepositoryPort.buscarTodos();
                
                if (alquileres.isEmpty()) {
                        
                        throw new AlquilerNoEncontradoException(NO_HAY_ALQUILERES);
                
                }
                return alquileres;
        }


        @Override
        public List<Alquiler> consultarPorEstado(EstadoAlquiler estado) {
                List<Alquiler> alquileres = alquilerRepositoryPort.buscarPorEstado(estado);
                
                if (alquileres.isEmpty()) {
                        throw new AlquilerNoEncontradoException(NO_HAY_ALQUILERES_ESTADO + estado);
                
                }
                return alquileres;
        }

        @Override
        public Alquiler registrarPago(
                Long alquilerId,
                Double valorPago) {
                        
                        if (valorPago == null || valorPago <= 0) {
                                
                                throw new DatosInvalidosException(VALOR_PAGO_INVALIDO);
                        
                        }
                        
                        Alquiler alquiler = alquilerRepositoryPort.buscarPorId(alquilerId).orElseThrow(() ->
                        new AlquilerNoEncontradoException(ALQUILER_NO_ENCONTRADO));
                        
                        Double totalPagado = alquiler.getValorPagado() + valorPago;
                        
                        alquiler.setValorPagado(totalPagado);
                        
                        return alquilerRepositoryPort.guardar(alquiler);
        }

        @Override
        public Alquiler finalizar(
                Long alquilerId) {
                        Alquiler alquiler = alquilerRepositoryPort.buscarPorId(alquilerId).orElseThrow(() ->
                        new AlquilerNoEncontradoException(ALQUILER_NO_ENCONTRADO));
                        
                        if (alquiler.getEstado() == EstadoAlquiler.FINALIZADO) {
                                throw new AlquilerFinalizadoException(ALQUILER_FINALIZADO);
                        }

                        Double SaldoPendiente = alquiler.getValorTotal() - alquiler.getValorPagado();
        
                        if (SaldoPendiente > 0) {
                        
                                throw new PagoPendienteException(
                                        "El alquiler se realizo por el valor de: "
                                        + formatearDinero(alquiler.getValorTotal())
                                        + " y solo se ha abonado: "
                                        + formatearDinero(alquiler.getValorPagado())
                                        + ". Para finalizar, por favor realice el pago pendiente de: "
                                        + formatearDinero(SaldoPendiente)
                                );
                        }
                
                        Auto auto = autoRepositoryPort.buscarPorId(alquiler.getAutoId()).orElseThrow(() ->
                        new AutoNoEncontradoException(AUTO_NO_ENCONTRADO));
                        
                        alquiler.setEstado(EstadoAlquiler.FINALIZADO);

                        Integer diasReales = alquiler.getDiasUtilizados() != null ? alquiler.getDiasUtilizados() : alquiler.getCantidadDias();

                        Integer kilometrosConsumidos = diasReales * KILOMETROS_POR_DIA;

                        Integer kilometrajeActual = auto.getKilometraje() == null ? 0 : auto.getKilometraje();

                        auto.setKilometraje(kilometrajeActual + kilometrosConsumidos);

                        if(auto.getKilometraje() >= 5000) {
                                
                                auto.setEstado(EstadoAuto.MANTENIMIENTO);
                        }

                        else if (auto.getEstado() != EstadoAuto.MANTENIMIENTO){

                                auto.setEstado(EstadoAuto.DISPONIBLE);
                        }

                        autoRepositoryPort.guardar(auto);

                        return alquilerRepositoryPort.guardar(alquiler);
        }

        @Override
        public Alquiler finalizarAnticipado(
                Long alquilerId,
                Integer diasUtilizados) {
                        
                        Alquiler alquiler = alquilerRepositoryPort.buscarPorId(alquilerId).orElseThrow(() ->
                        new AlquilerNoEncontradoException(ALQUILER_NO_ENCONTRADO));
                        
                        if (alquiler.getEstado() == EstadoAlquiler.FINALIZADO) {
                                
                                throw new AlquilerFinalizadoException(ALQUILER_FINALIZADO);
                        }

                        if (diasUtilizados == null || diasUtilizados <= 0) {
                                
                                throw new DatosInvalidosException(DIAS_INVALIDOS);
                        }
                        if (diasUtilizados > alquiler.getCantidadDias()) {
                                throw new DatosInvalidosException(DIAS_UTILIZADOS_INVALIDOS);
                        }
                        
                        Auto auto = autoRepositoryPort.buscarPorId(alquiler.getAutoId()).orElseThrow(() ->
                        new AutoNoEncontradoException(AUTO_NO_ENCONTRADO));
                        
                        double nuevoValorTotal = auto.getPrecioPorDia() * diasUtilizados;
                        
                        alquiler.setDiasUtilizados(diasUtilizados);

                        alquiler.setValorTotal(nuevoValorTotal);

                        alquilerRepositoryPort.guardar(alquiler);
                        
                        Double SaldoPendiente = nuevoValorTotal - alquiler.getValorPagado();
                        
                        if (SaldoPendiente > 0) {
                                
                                throw new PagoPendienteException(
                                        "El alquiler fue recalculado al valor de: "
                                        + formatearDinero(nuevoValorTotal)
                                        + " y solo se ha abonado: "
                                        + formatearDinero(alquiler.getValorPagado())
                                        + ". Para finalizar, por favor realice el pago pendiente de: "
                                        + formatearDinero(SaldoPendiente)
                                );
                        }
                        
                        return finalizar(alquilerId);
        }

}
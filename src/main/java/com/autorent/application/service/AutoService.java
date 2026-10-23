package com.autorent.application.service;

import com.autorent.application.port.input.RegistrarAutoUseCase;
import com.autorent.application.port.input.ConsultarAutoUseCase;
import com.autorent.application.port.input.ConsultarAutosDisponiblesUseCase;
import com.autorent.application.port.input.ConsultarAutosPorEstadoUseCase;
import com.autorent.application.port.input.ConsultarTodosAutosUseCase;
import com.autorent.application.port.input.EliminarAutoUseCase;
import com.autorent.application.port.input.EnviarAutoATallerUseCase;
import com.autorent.application.port.input.HabilitarAutoUseCase;
import com.autorent.application.port.input.RegistrarKilometrajeUseCase;
import com.autorent.application.port.output.AutoRepositoryPort;
import com.autorent.domain.exception.AutoNoEncontradoException;
import com.autorent.domain.exception.DatosInvalidosException;
import com.autorent.domain.exception.NoHayAutosPorEstadoException;
import com.autorent.domain.exception.AutoDuplicadoException;
import com.autorent.domain.exception.AutoNoEliminableException;
import com.autorent.domain.model.Auto;
import com.autorent.domain.model.EstadoAuto;
import static com.autorent.domain.constants.ErrorMessages.*;

import java.util.List;

public class AutoService implements
        RegistrarAutoUseCase,
        ConsultarAutoUseCase,
        ConsultarAutosDisponiblesUseCase,
        ConsultarAutosPorEstadoUseCase,
        ConsultarTodosAutosUseCase,
        EliminarAutoUseCase,
        RegistrarKilometrajeUseCase,
        EnviarAutoATallerUseCase,
        HabilitarAutoUseCase {

    private final AutoRepositoryPort autoRepositoryPort;

    public AutoService(AutoRepositoryPort autoRepositoryPort) {
        this.autoRepositoryPort = autoRepositoryPort;
    }

    @Override
    public Auto registrar(Auto auto) {
        if (auto.getPlaca() == null || auto.getPlaca().isBlank()) {
            
            throw new DatosInvalidosException(PLACA_OBLIGATORIA);
        }

        auto.setPlaca(auto.getPlaca().toUpperCase());

        if (!auto.getPlaca().matches("^[A-Z]{3}[0-9]{3}$")) {
            
            throw new DatosInvalidosException(FORMATO_PLACA_INVALIDO);
        }
        
        autoRepositoryPort.buscarPorPlaca(auto.getPlaca()).ifPresent(autoExistente -> {
            
            throw new AutoDuplicadoException(AUTO_DUPLICADO);
        });
    
        if (auto.getMarca() == null || auto.getMarca().isBlank()) {

            throw new DatosInvalidosException(MARCA_OBLIGATORIA);
        }

        if (auto.getModelo() == null || auto.getModelo().isBlank()) {

            throw new DatosInvalidosException(MODELO_OBLIGATORIO);
        }

        if (auto.getAnio() == null) {

            throw new DatosInvalidosException(ANIO_OBLIGATORIO);
        }

        if (auto.getAnio() <= 0) {

            throw new DatosInvalidosException(ANIO_INVALIDO);
        }

        if (auto.getPrecioPorDia() == null) {

            throw new DatosInvalidosException(PRECIO_OBLIGATORIO);
        }

        if (auto.getPrecioPorDia() <= 0) {

            throw new DatosInvalidosException(PRECIO_INVALIDO);
        }
        
        auto.setEstado(EstadoAuto.DISPONIBLE);
        
        return autoRepositoryPort.guardar(auto);
    }

    @Override
    public Auto consultarPorId(Long id) {
        
        return autoRepositoryPort.buscarPorId(id).orElseThrow(() ->
        new AutoNoEncontradoException(AUTO_NO_ENCONTRADO));
    }

    @Override
    public List<Auto> consultarDisponibles() {
        
        List<Auto> autos = autoRepositoryPort.buscarPorEstado(EstadoAuto.DISPONIBLE);
        if (autos.isEmpty()) {
            
            throw new NoHayAutosPorEstadoException(NO_HAY_AUTOS_POR_ESTADO + EstadoAuto.DISPONIBLE);
        }

        return autos;
    }

    @Override
    public List<Auto> consultarTodos() {

        List<Auto> autos = autoRepositoryPort.buscarTodos();
        if (autos.isEmpty()) {
            
            throw new NoHayAutosPorEstadoException(NO_HAY_AUTOS_REGISTRADOS);
        }
        return autos;
    }

    @Override
    public List<Auto> consultarPorEstado(
        EstadoAuto estado) {
            
        List<Auto> autos = autoRepositoryPort.buscarPorEstado(estado);

        if (autos.isEmpty()) {
            
            throw new NoHayAutosPorEstadoException(NO_HAY_AUTOS_POR_ESTADO + estado);
        }
        return autos;
    }

    @Override
    public void eliminar(Long id) {
        
        Auto auto = autoRepositoryPort.buscarPorId(id).orElseThrow(() ->
        
        new AutoNoEncontradoException(AUTO_NO_ENCONTRADO));
        
        if(auto.getEstado() != EstadoAuto.DISPONIBLE){
            
            throw new AutoNoEliminableException(AUTO_NO_ELIMINABLE);
        }
        
        autoRepositoryPort.eliminar(auto.getId());
    }

    @Override
    public void registrarKilometraje(Long autoId, Integer kilometros){

        Auto auto = autoRepositoryPort.buscarPorId(autoId).orElseThrow(() ->
        
        new AutoNoEncontradoException(AUTO_NO_ENCONTRADO));

        if(kilometros == null || kilometros <= 0){
            throw new DatosInvalidosException(KILOMETRAJE_INVALIDO);
        }

        Integer kilometrajeActual = auto.getKilometraje() == null ? 0 : auto.getKilometraje();
        
        auto.setKilometraje(kilometrajeActual + kilometros);

        autoRepositoryPort.guardar(auto);
    }
        
    @Override
    public void enviarATaller(Long autoId) {
                        
        Auto auto = autoRepositoryPort.buscarPorId(autoId).orElseThrow(() ->
        
        new AutoNoEncontradoException(AUTO_NO_ENCONTRADO));
                        
        auto.setEstado(EstadoAuto.MANTENIMIENTO);
                        
        autoRepositoryPort.guardar(auto);
    }

    @Override
    public void habilitar(Long autoId){
                        
        Auto auto = autoRepositoryPort.buscarPorId(autoId).orElseThrow(() ->
        
        new AutoNoEncontradoException(AUTO_NO_ENCONTRADO));
        
        if(auto.getEstado() != EstadoAuto.MANTENIMIENTO){
            
            throw new DatosInvalidosException(AUTO_NO_EN_TALLER);
        }

        auto.setKilometraje(0);

        auto.setEstado(EstadoAuto.DISPONIBLE);
                        
        autoRepositoryPort.guardar(auto);
    }
}
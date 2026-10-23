package com.autorent.application.port.output;

import com.autorent.domain.model.Auto;
import com.autorent.domain.model.EstadoAuto;

import java.util.List;
import java.util.Optional;

public interface AutoRepositoryPort {

    Auto guardar(Auto auto);

    Optional<Auto> buscarPorId(Long id);

    List<Auto> buscarDisponibles();

    List<Auto> buscarTodos();

    List<Auto> buscarPorEstado(EstadoAuto estado);

    void eliminar(Long id);

    Optional<Auto> buscarPorPlaca(String placa);

}
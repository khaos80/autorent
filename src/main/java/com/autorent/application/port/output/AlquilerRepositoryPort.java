package com.autorent.application.port.output;

import com.autorent.domain.model.Alquiler;
import com.autorent.domain.model.EstadoAlquiler;

import java.util.*;

public interface AlquilerRepositoryPort {

    Alquiler guardar(Alquiler alquiler);

    Optional<Alquiler> buscarPorId(Long id);

    List<Alquiler> buscarTodos();

    List<Alquiler> buscarPorEstado(EstadoAlquiler estado);

}
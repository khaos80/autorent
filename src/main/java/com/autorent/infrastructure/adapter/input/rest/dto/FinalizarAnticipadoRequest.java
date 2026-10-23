package com.autorent.infrastructure.adapter.input.rest.dto;

public class FinalizarAnticipadoRequest {

    private Integer diasUtilizados;

    public FinalizarAnticipadoRequest() {
    }

    public Integer getDiasUtilizados() {
        return diasUtilizados;
    }

    public void setDiasUtilizados(
            Integer diasUtilizados) {

        this.diasUtilizados = diasUtilizados;
    }
}
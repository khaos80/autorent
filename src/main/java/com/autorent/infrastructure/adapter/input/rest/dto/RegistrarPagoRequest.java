package com.autorent.infrastructure.adapter.input.rest.dto;

public class RegistrarPagoRequest {

    private Double valorPago;

    public RegistrarPagoRequest() {
    }

    public Double getValorPago() {
        return valorPago;
    }

    public void setValorPago(Double valorPago) {
        this.valorPago = valorPago;
    }
}
package com.autorent.domain.model;

import java.time.LocalDate;

public class Alquiler {
    
    private Long id;
    private Long clienteId;
    private Long autoId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer cantidadDias;
    private Integer diasUtilizados;
    private Double valorTotal;
    private Double valorPagado;
    private EstadoAlquiler estado;

    public Alquiler() {
    }

    public Alquiler(Long id, Long clienteId, Long autoId, LocalDate fechaInicio, LocalDate fechaFin, Integer cantidadDias, Integer diasUtilizados, Double valorTotal, Double valorPagado, EstadoAlquiler estado) {
        this.id = id;
        this.clienteId = clienteId;
        this.autoId = autoId;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.cantidadDias = cantidadDias;
        this.diasUtilizados = diasUtilizados;
        this.valorTotal = valorTotal;
        this.valorPagado = valorPagado;
        this.estado = estado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getAutoId() {
        return autoId;
    }

    public void setAutoId(Long autoId) {
        this.autoId = autoId;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Integer getCantidadDias() {
        return cantidadDias;
    }

    public void setCantidadDias(Integer cantidadDias) {
        this.cantidadDias = cantidadDias;
    }

    public Integer getDiasUtilizados() {
        return diasUtilizados;
    }

    public void setDiasUtilizados(Integer diasUtilizados) {
        this.diasUtilizados = diasUtilizados;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public Double getValorPagado() {
        return valorPagado;
    }

    public void setValorPagado(Double valorPagado) {
        this.valorPagado = valorPagado;
    }

    public EstadoAlquiler getEstado() {
        return estado;
    }

    public void setEstado(EstadoAlquiler estado) {
        this.estado = estado;
    }
}

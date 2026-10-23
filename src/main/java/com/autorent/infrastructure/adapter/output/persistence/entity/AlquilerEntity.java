package com.autorent.infrastructure.adapter.output.persistence.entity;

import java.time.LocalDate;

import com.autorent.domain.model.EstadoAlquiler;

import jakarta.persistence.*;

@Entity
@Table(name = "alquileres")
public class AlquilerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long clienteId;

    private Long autoId;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private Integer cantidadDias;

    private Integer diasUtilizados;

    private Double valorTotal;

    private Double valorPagado;

    @Enumerated(EnumType.STRING)
    private EstadoAlquiler estado;

    public AlquilerEntity() {
    }

    public AlquilerEntity(Long id,
                          Long clienteId,
                          Long autoId,
                          LocalDate fechaInicio,
                          LocalDate fechaFin,
                          Integer cantidadDias,
                        Integer diasUtilizados,
                          Double valorTotal,
                          Double valorPagado,
                          EstadoAlquiler estado) {

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

    public Long getClienteId() {
        return clienteId;
    }

    public Long getAutoId() {
        return autoId;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public Integer getCantidadDias() {
        return cantidadDias;
    }

    public Integer getDiasUtilizados() {
        return diasUtilizados;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public Double getValorPagado() {
        return valorPagado;
    }

    public EstadoAlquiler getEstado() {
        return estado;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public void setAutoId(Long autoId) {
        this.autoId = autoId;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public void setCantidadDias(Integer cantidadDias) {
        this.cantidadDias = cantidadDias;
    }

    public void setDiasUtilizados(Integer diasUtilizados) {
        this.diasUtilizados = diasUtilizados;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public void setValorPagado(Double valorPagado) {
        this.valorPagado = valorPagado;
    }

    public void setEstado(EstadoAlquiler estado) {
        this.estado = estado;
    }
}
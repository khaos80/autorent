package com.autorent.infrastructure.adapter.output.persistence.entity;

import com.autorent.domain.model.EstadoAuto;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "autos")
public class AutoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String placa;

    private String marca;

    private String modelo;

    private Integer anio;

    private Double precioPorDia;

    @Enumerated(EnumType.STRING)
    private EstadoAuto estado;

    private Integer kilometraje;

    public AutoEntity() {
    }

    public AutoEntity(Long id,
        String placa,
        String marca,
        String modelo,
        Integer anio,
        Double precioPorDia,
        EstadoAuto estado,
        Integer kilometraje
    ) {

        this.id = id;
        this.placa = placa;
        this.marca = marca;
        this.modelo = modelo;
        this.anio = anio;
        this.precioPorDia = precioPorDia;
        this.estado = estado;
        this.kilometraje = kilometraje;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public Double getPrecioPorDia() {
        return precioPorDia;
    }

    public void setPrecioPorDia(Double precioPorDia) {
        this.precioPorDia = precioPorDia;
    }

    public EstadoAuto getEstado() {
        return estado;
    }

    public void setEstado(EstadoAuto estado) {
        this.estado = estado;
    }

    public Integer getKilometraje() {
        return kilometraje;
    }
    public void setKilometraje(Integer kilometraje) {
        this.kilometraje = kilometraje;
    }
}
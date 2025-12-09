package com.rra.local_mission_management.entity;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
@Table(name = "placements_structure_map")
@Data
public class PlacementsStructureMap {

    @Id
    @Column(name = "id")
    private int id;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "structure_id", referencedColumnName = "structure_id")
    private Structure structure;

}

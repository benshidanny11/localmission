package com.rra.local_mission_management.entity;

import lombok.Data;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "structures")
@Data
public class Structure {
    @Id
    @Column(name = "structure_id")
    private int structureId;

    @Column(name = "structure_name")
    private String structureName;

    @Column(name = "structure_type")
    private String structureType;

    @Column(name = "level")
    private Byte level;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "reference_id")
    private int referenceId;
}

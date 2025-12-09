package com.rra.local_mission_management.entity;

import lombok.Data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "placements")
@Data
public class Placement {
    
    @Id
    @Column(name = "placement_id")
    private int placementId;

    @ManyToOne
    @JoinColumn(name = "structure_id", referencedColumnName = "structure_id")
    private Structure structure;

    @ManyToOne
    @JoinColumn(name = "job_master_id", referencedColumnName = "job_master_id")
    private JobMaster jobMaster;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id", nullable = false)
    private Employee employee;

    @JsonIgnore
    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @JsonIgnore
    @Column(name = "admin_id", nullable = false)
    private int adminId;

    @JsonIgnore
    @Column(name = "placement_type", nullable = false)
    private int placementType;

}


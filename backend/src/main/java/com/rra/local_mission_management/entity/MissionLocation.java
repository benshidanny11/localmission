package com.rra.local_mission_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import lombok.Data;

import java.sql.Date;

@Data
@Entity
@Table(name = "mission_location")
public class MissionLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(name = "zone", nullable = false)
    private int zone;

    @Column(name = "end_date")
    private Date endDate;
}

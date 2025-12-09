package com.rra.local_mission_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

import java.sql.Date;

@Data
@Entity
@Table(name = "mission_allowance")
public class MissionAllowance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "grade_id", referencedColumnName = "grade_id", nullable = true)
    private Grade grade;

    @Column(nullable = false)
    private String position;

    @Column(name = "daily_allowance", nullable = false)
    private String dailyAllowance;

    @Column(name = "zone_1", nullable = false)
    private String zone1;

    @Column(name = "zone_2", nullable = false)
    private String zone2;

    @Column(name = "zone_3", nullable = false)
    private String zone3;

    @Column(name = "zone_4", nullable = false)
    private String zone4;

    @Column(name = "end_date")
    private Date endDate;
}

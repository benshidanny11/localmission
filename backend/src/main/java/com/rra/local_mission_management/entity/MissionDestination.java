package com.rra.local_mission_management.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.rra.local_mission_management.serializer.DistrictSerializer;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "mission_destination")
public class MissionDestination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonSerialize(using = DistrictSerializer.class)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district; 

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "number_of_days", nullable = false)
    private int numberOfDays;

    @Column(name = "number_of_nights", nullable = false)
    private int numberOfNights;

    @Column(name = "day_rate", nullable = false)
    private String dayRate;

    @Column(name = "night_rate", nullable = false)
    private String nightRate;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_details_id", nullable = false)
    private MissionDetails missionDetails;
}

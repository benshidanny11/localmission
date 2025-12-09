package com.rra.local_mission_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rra.local_mission_management.enums.DocType;

import jakarta.persistence.Column;
import jakarta.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "mission_file")
public class MissionFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mission_doc_file", nullable = false)
    private String missionFile;

    @Enumerated(EnumType.STRING)
    @Column(name = "mission_doc_type", nullable = false)
    private DocType missionDocType;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "mission_details_id", nullable = false)
    private MissionDetails missionDetails;
}

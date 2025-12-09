package com.rra.local_mission_management.entity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.rra.local_mission_management.enums.Status;
import com.rra.local_mission_management.serializer.EmployeeIdSerializer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name= "mission_history_record")
public class MissionHistoryRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private long historyId;

    @Column(name = "type_of_reason", nullable = false)
    private Status status;

    @JsonSerialize(using = EmployeeIdSerializer.class)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by", nullable = false)
    private Employee performedBy;

    @Temporal(TemporalType.DATE)
    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    @Column(name = "comment", nullable = false)
    private String comment;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_details_id", nullable = false)
    private MissionDetails missionDetails;

    public MissionHistoryRecord() {
        this.createdAt = new Date();
    }

}

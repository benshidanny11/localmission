package com.rra.local_mission_management.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.rra.local_mission_management.enums.Status;
import com.rra.local_mission_management.serializer.EmployeeSerializer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

@Data
@Entity
@Table(name = "notification")
@DynamicUpdate
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonSerialize(using = EmployeeSerializer.class)
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private String title;

    private String message;

    @Column(name = "reference_id", nullable = true)
    private String referenceId;

    private Status type;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "date")
    private LocalDateTime date;

    public Notification() {}
}

package com.rra.local_mission_management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;



@Entity
@Table(name = "departments")
@Data
public class Department {
    enum Category { imported, newc }

    @Id
    @Column(name = "department_id")
    private int departmentId;

    @Column(name = "department_name")
    private String departmentName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private Category category;

}

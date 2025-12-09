package com.rra.local_mission_management.entity;

import lombok.Data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "districts")
@Data
public class District {
    @Id
    @Column(name = "district_code")
    private int districtCode;

    @Column(name = "district_name")
    private String districtName;

    @Column(name = "province_code")
    private int provinceCode;
}

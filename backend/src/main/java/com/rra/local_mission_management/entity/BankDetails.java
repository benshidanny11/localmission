package com.rra.local_mission_management.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.rra.local_mission_management.serializer.BankDetailsSerializer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "bank_details")
@JsonSerialize(using = BankDetailsSerializer.class )
public class BankDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bankId;

    @Column(name = "bank_code", nullable = false)
    private String bankCode;

    @Column(name = "bank_account", nullable = false, unique = true)
    private String bankAccount;

    @Column(name = "bank_name", nullable = false)
    private String bankName;   
    
    @OneToOne
    @JoinColumn(name ="employee_id", nullable = false)
    private Employee employee;
}
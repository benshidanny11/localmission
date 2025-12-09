package com.rra.local_mission_management.entity;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.rra.local_mission_management.enums.BatchStatus;
import com.rra.local_mission_management.serializer.MissionDetailsSerializer;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name= "mission_payment_batch")
public class MissionPaymentBatch {

    @Id
    @Column(name = "Batch", nullable = false, unique = true)
    private String sn;

    @Column(name = "payment_type", nullable = false)
    private String paymentType;

    @Column(name = "amount",nullable = false)
    private Double amount;

    @Column(name ="iban", nullable = true)
    private String iban;

    @Column(name = "description", nullable = false)
    private String description;

    @Temporal(TemporalType.DATE)
    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    @Column(name="status", nullable = false)
    private String status;
    
    
    @JsonSerialize(using = MissionDetailsSerializer.class)
    @OneToMany(mappedBy = "missionPaymentBatch", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MissionDetails> missionDetails;

    

    public MissionPaymentBatch() {
        this.createdAt = new Date();
        this.status = BatchStatus.PMT_BATCH_CREATED.getStatus();
        
    }
   
}
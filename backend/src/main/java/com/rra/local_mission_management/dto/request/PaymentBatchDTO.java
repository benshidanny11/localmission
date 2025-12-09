package com.rra.local_mission_management.dto.request;

import java.util.Date;

import lombok.Data;

@Data
public class PaymentBatchDTO {
    private String sn;
    private Double amount;
    private String description;
    private String status;
    private Date createdAt;

    public PaymentBatchDTO(String sn, Double amount, String description, String status, Date createdAt) {
        this.sn = sn;
        this.amount = amount;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
    }
    

    

    
    
}

package com.rra.local_mission_management.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class PaymentBatchRequest {
    private String paymentType;
    private String iban;
    private String description;
    private List<String> missionId;

    
    public PaymentBatchRequest(String paymentType, String iban, String description, List<String> missionId) {
        this.paymentType = paymentType;
        this.iban = iban;
        this.description = description;
        this.missionId = missionId;
    }

    
    
  

   


    
    
}

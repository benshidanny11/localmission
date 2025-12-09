package com.rra.local_mission_management.dto.request;

import lombok.Data;

@Data
public class MissionPaymentDetailsDTO {

    private String employeeId;
    private String givenName;
    private String familyName;
    private String bankAccount;
    private Double amount;
    private String paymentType;
    private String iban;

    public MissionPaymentDetailsDTO(String employeeId, String givenName, String familyName, String bankAccount,
            Double amount, String paymentType, String iban) {
        this.employeeId = employeeId;
        this.givenName = givenName;
        this.familyName = familyName;
        this.bankAccount = bankAccount;
        this.amount = amount;
        this.paymentType = paymentType;
        this.iban = iban;
    }

    

    
    
}

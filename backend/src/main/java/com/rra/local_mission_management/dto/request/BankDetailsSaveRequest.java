package com.rra.local_mission_management.dto.request;

import lombok.Data;

@Data
public class BankDetailsSaveRequest {
    private String bankAccount;
    private String bankCode;
    private String bankName;
    private String employeeId;
}
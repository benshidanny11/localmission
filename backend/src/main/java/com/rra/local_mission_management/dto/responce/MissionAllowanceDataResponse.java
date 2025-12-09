package com.rra.local_mission_management.dto.responce;

import lombok.Data;

@Data
public class MissionAllowanceDataResponse {
    private String employeeId;
    private Object amount;

    
    public MissionAllowanceDataResponse(String employeeId, Object amount) {
        this.employeeId = employeeId;
        this.amount = amount;
    }

    
}

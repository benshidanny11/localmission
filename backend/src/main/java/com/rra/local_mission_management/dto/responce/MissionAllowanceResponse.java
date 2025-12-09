package com.rra.local_mission_management.dto.responce;

import lombok.Data;

@Data
public class MissionAllowanceResponse {
    private String message;
    private MissionAllowanceDataResponse data;
    public MissionAllowanceResponse(String message, MissionAllowanceDataResponse data) {
        this.message = message;
        this.data = data;
    }

    
}
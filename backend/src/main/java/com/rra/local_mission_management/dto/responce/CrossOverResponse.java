package com.rra.local_mission_management.dto.responce;

import lombok.Data;

@Data
public class CrossOverResponse {
    private String message;
    private int status;
    private boolean isCrossOver;

    public CrossOverResponse(String message, int status, boolean isCrossOver) {
        this.message = message;
        this.status = status;
        this.isCrossOver = isCrossOver;
    }
}

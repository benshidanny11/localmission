package com.rra.local_mission_management.dto.responce;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MissionErrorResponse {
    private String message;
    private int status;
}

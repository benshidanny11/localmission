package com.rra.local_mission_management.dto.responce;

import com.rra.local_mission_management.entity.MissionDetails;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MissionSuccessResponse {
    private String message;
    private MissionDetails data;
    private int status;
}

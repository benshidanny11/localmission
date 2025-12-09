package com.rra.local_mission_management.dto.request;

import java.util.List;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MissionAllowanceDTO {
    private String employeeId;
    private List<MissionAllowanceDistrictDTO> missionAllowance;

    
}

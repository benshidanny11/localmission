package com.rra.local_mission_management.dto.request;

import lombok.Data;

@Data
public class MissionAllowanceDistrictDTO {
    private int districtId;
    private int numberOfDays;
    private int numberOfNights;
}

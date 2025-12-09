package com.rra.local_mission_management.dto.request;

import lombok.Data;

@Data
public class MissionDestinationDTO {

    private String districtId;
    private String startDate;
    private String endDate;
    private Integer numberOfDays;
    private Integer numberOfNights;

    // Getters and Setters
}

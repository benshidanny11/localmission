package com.rra.local_mission_management.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class MissionDetailsDTO {

    private String employeeId;
    private String purposeOfMission;
    private String expectedResults;
    private String proposerId;
    private String approverId;
    private String place;
    private String startDate;
    private String endDate;
    private Integer missionDays;
    private Integer missionNights;
    private String transportMode;
    private Double missionAllowance;
    private String plate;
    private String status;
    private List<MissionDestinationDTO> missionDestinations;

}

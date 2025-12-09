package com.rra.local_mission_management.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class MissionDetailsHodUpdateDto {
    private String referenceId;
    private String purposeOfMission;
    private String expectedResults;
    private String startDate;
    private String endDate;
    private Integer missionDays;
    private Integer missionNights;
    private Double missionAllowance;
    private List<MissionDestinationHodDTO> missionDestinations;
    private String weekendReason;
}

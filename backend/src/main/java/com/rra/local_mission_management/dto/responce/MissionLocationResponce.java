package com.rra.local_mission_management.dto.responce;

import java.util.List;

import com.rra.local_mission_management.entity.MissionLocation;

import lombok.Data;

@Data
public class MissionLocationResponce {

    private String message;
    private List<MissionLocation> data;
}

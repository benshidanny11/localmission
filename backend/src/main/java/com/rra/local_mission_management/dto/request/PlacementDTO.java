package com.rra.local_mission_management.dto.request;

import lombok.Data;

@Data
public class PlacementDTO {
    private StructureDTO structure;
    private JobMasterDTO jobMaster;

    public PlacementDTO(StructureDTO structure, JobMasterDTO jobMaster) {
        this.structure = structure;
        this.jobMaster = jobMaster;
    }
}

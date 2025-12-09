package com.rra.local_mission_management.dto.request;

import lombok.Data;

@Data
public class StructureDTO {
    private int structureId;
    private String structureName;
    private String structureType;

    public StructureDTO(int structureId, String structureName, String structureType) {
        this.structureId = structureId;
        this.structureName = structureName;
        this.structureType = structureType;
    }
}

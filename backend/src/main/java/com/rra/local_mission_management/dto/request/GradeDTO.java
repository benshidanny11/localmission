package com.rra.local_mission_management.dto.request;

import lombok.Data;

@Data
public class GradeDTO {
    private int gradeId;
    private String gradeName;
    private String shortName;

    public GradeDTO(int gradeId, String gradeName, String shortName) {
        this.gradeId = gradeId;
        this.gradeName = gradeName;
        this.shortName = shortName;
    }
}

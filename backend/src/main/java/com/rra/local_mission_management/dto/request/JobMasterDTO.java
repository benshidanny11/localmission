package com.rra.local_mission_management.dto.request;

import lombok.Data;

@Data
public class JobMasterDTO {
    private int jobMasterId;
    private String jobTitle;
    private GradeDTO grade;

    // Constructors, getters, and setters
    public JobMasterDTO(int jobMasterId, String jobTitle, GradeDTO grade) {
        this.jobMasterId = jobMasterId;
        this.jobTitle = jobTitle;
        this.grade = grade;
    }

}

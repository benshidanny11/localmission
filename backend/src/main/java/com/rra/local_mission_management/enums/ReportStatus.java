package com.rra.local_mission_management.enums;

public enum ReportStatus {
    NOT_SUBMITTED, 
    SUBMITTED;
    
    public boolean isSubmitted() {
        return this == SUBMITTED;
    }
}

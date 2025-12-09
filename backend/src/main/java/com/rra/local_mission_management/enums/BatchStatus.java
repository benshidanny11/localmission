package com.rra.local_mission_management.enums;

public enum BatchStatus {
    PMT_BATCH_CREATED("pmt batch created"),
    CANCELLED("cancelled");

    private final String status;

    BatchStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public static BatchStatus fromValue(String status) {
        for (BatchStatus batchStatus : BatchStatus.values()) {
            if (batchStatus.getStatus().equalsIgnoreCase(status)) {
                return batchStatus;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + status);
    }
}

package com.rra.local_mission_management.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComputeMissionRequest {
    private Double distance;
    private Double mileage;
    @NotNull(message = "Transport Mileage Allowance is required")
    private Double transportMileageAllowance;
    private Double totalAmount;
}

package com.rra.local_mission_management.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MissionRequestReasonDto {
    @NotEmpty(message = "Reason is required.")
    @Size(max = 50, message = "Reason cannot be more than 50 words.")
    private String reason;
}

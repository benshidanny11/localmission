package com.rra.local_mission_management.dto.request;

import lombok.Data;

@Data
public class PasswordResetRequest {
    private String token;
    private String code;
    private String newPassword;
    private String confirmPassword;
}
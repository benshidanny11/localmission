package com.rra.local_mission_management.controller.api;

import com.rra.local_mission_management.dto.request.PasswordResetRequest;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.PasswordResetToken;
import com.rra.local_mission_management.service.EmployeeService;
import com.rra.local_mission_management.service.PasswordResetService;
import com.rra.local_mission_management.service.PasswordTokenService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/password")
public class PasswordResetController {

    @Autowired
    private PasswordTokenService passwordTokenService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/request-reset")
    public ResponseEntity<Map<String, Object>> requestPasswordReset(@RequestParam("email") String employeeEmail) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Assuming you have a service method to find employee by email
            Optional<Employee> employeeOpt = employeeService.findFirstByWorkEmailOrPersonalEmail(employeeEmail);

            if (employeeOpt.isPresent()) {
                Employee employee = employeeOpt.get();

                // Generate the password reset token and send the email
                PasswordResetToken resetToken = passwordTokenService.generatePasswordResetToken(employee);

                // Prepare the success response with token
                response.put("message", "Password reset link sent to your email.");
                response.put("token", resetToken.getToken());
                response.put("status", HttpStatus.OK.value());

                return ResponseEntity.ok(response);
            } else {
                // Employee not found, prepare response without token
                response.put("message", "Employee with the provided email not found.");
                response.put("token", null);
                response.put("status", HttpStatus.NOT_FOUND.value());

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            // Handle any exceptions
            response.put("message", "Error generating password reset link: " + e.getMessage());
            response.put("token", null);
            response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody PasswordResetRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate that the new password and confirm password match
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                response.put("message", "Passwords do not match.");
                response.put("status", HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Reset the password using the service
            passwordResetService.resetPassword(request.getToken(), request.getCode(), request.getNewPassword());
            
            // Prepare the success response
            response.put("message", "Password has been successfully reset.");
            response.put("status", HttpStatus.OK.value());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Handle any exceptions
            response.put("message", "Failed to reset password: " + e.getMessage());
            response.put("status", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

}

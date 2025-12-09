package com.rra.local_mission_management.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rra.local_mission_management.dto.responce.ApiResponse;
import com.rra.local_mission_management.dto.responce.ResponseDto;
import com.rra.local_mission_management.entity.Notification;
import com.rra.local_mission_management.service.NotificationService;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getAll(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            List<Notification> notifications = notificationService.findAllByEmployeeId(username);

            ResponseDto<List<Notification>> responseDto = new ResponseDto<>();
            responseDto.setMessage("Notifications retrieved successfully");
            responseDto.setData(notifications);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            // Log the exception here
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("An error occurred while retrieving notifications.", HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PatchMapping("/mark-as-read")
    public ResponseEntity<ApiResponse> markNotificationsAsRead(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            notificationService.markNotificationsAsReadForEmployee(username);
            return ResponseEntity.ok(new ApiResponse("All notifications marked as read successfully", HttpStatus.OK.value()));
        } catch (Exception e) {
            // Log the exception here
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("An error occurred while marking notifications as read.", HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }
}

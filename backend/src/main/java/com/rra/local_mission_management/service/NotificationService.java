package com.rra.local_mission_management.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.Notification;
import com.rra.local_mission_management.repository.NotificationRepository;

@Service
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    // Save a notification
    @Async
    public void saveNotification(Notification notification) {
        try {
            Notification savedNotification = notificationRepository.save(notification);
            simpMessagingTemplate.convertAndSendToUser(notification.getEmployee().getEmployeeId(),"/topic/notifications", savedNotification);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    // // Get all notifications by employee ID
    public List<Notification> findAllByEmployeeId(String employeeId) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        return notificationRepository.findAllByEmployee_EmployeeIdAndIsReadOrDateAfterOrderByIdDesc(employeeId, false, oneWeekAgo);
    }

    public void markNotificationsAsReadForEmployee(String employeeId) {
        notificationRepository.markAllAsReadForEmployee(employeeId);
    }

}

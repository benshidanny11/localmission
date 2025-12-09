package com.rra.local_mission_management.config;

import org.springframework.stereotype.Component;

@Component
public class ComplianceChecker {

    // @Autowired
    // private MissionDetailsService missionService;

    // @Autowired
    // private NotificationService notificationService;

    // @Autowired
    // private EmailService emailService;

    // // @Scheduled(fixedRate = 86400000)
    // // @Scheduled(fixedRate = 300000)
    // @Scheduled(fixedRate = 60000)
    // @SendTo("/topic/notifications")
    // public void checkCompliance() {
    //     List<MissionDetails> missions = missionService.getMissionsForComplianceCheck();
    //     LocalDate today = LocalDate.now();
    //     List<String> emails = new ArrayList<>();
    //     for (MissionDetails mission : missions) {

    //         if (shouldSendNotification(mission, today)) {

    //         emails.add(mission.getEmployee().getWorkEmail());
    //         Notification notification = new Notification();

    //         notification.setEmployee(mission.getEmployee());
    //         notification.setTitle("Mission Report Required");
    //         notification.setMessage("A mission report is required for your mission order with reference ID: " + mission.getReferenceId() + ". Please submit your report as soon as possible.");
    //         notification.setType(Status.REPORTED);
    //         notification.setIsRead(false);
    //         notification.setDate(LocalDateTime.now());
    //         notificationService.saveNotification(notification);
    //         }
    //     }
    //     emailService.reportRemainderEmail(emails);
    // }

    // // @Scheduled(fixedRate = 60000)
    // // @SendTo("/topic/notifications")
    // // public void checkCompliance() {
    // //     List<MissionDetails> missions = missionService.getMissionsForComplianceCheck();
    // //     LocalDate today = LocalDate.now();
    // //     List<String> emails = new ArrayList<>();
    // //     for (MissionDetails mission : missions) {
    // //         try {
    // //             if (shouldSendNotification(mission, today)) {
    // //                 emails.add(mission.getEmployee().getWorkEmail());
    // //                 Notification notification = new Notification();
    // //                 notification.setEmployee(mission.getEmployee());
    // //                 notification.setTitle("Mission Report Required");
    // //                 notification.setMessage("A mission report is required for your mission order with reference ID: " + mission.getReferenceId() + ". Please submit your report as soon as possible.");
    // //                 notification.setType(Status.REPORTED);
    // //                 notification.setIsRead(false);
    // //                 notification.setDate(LocalDateTime.now());
    // //                 notificationService.saveNotification(notification);
    // //             }
    // //         } catch (Exception e) {
    // //             e.printStackTrace(); // Log the exception
    // //         }
            
    // //         emailService.reportRemainderEmail(emails);
    // //     }
    // // }


    // private boolean shouldSendNotification(MissionDetails mission, LocalDate today) {
    //     LocalDate endDatePlus8Days = mission.getEndDate().plusDays(2);
    //     return !mission.getIsReportSubmissionRemained() && endDatePlus8Days.isAfter(today);
    // }
}

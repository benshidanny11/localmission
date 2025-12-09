package com.rra.local_mission_management.service;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Properties;
import java.io.IOException;
import java.io.InputStream;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.MissionDestination;
import com.rra.local_mission_management.entity.MissionDetails;
import com.rra.local_mission_management.utils.EmailTemplateLoader;

@Service
public class EmailService {

    @Value("${mail.smtp.server}")
    private String smtpServer;

    @Value("${mail.smtp.port}")
    private String smtpPort;

    @Value("${mail.smtp.username}")
    private String username;

    @Value("${mail.smtp.email}")
    private String emailAddress;

    @Value("${mail.smtp.password}")
    private String password;

    @Value("${app.email.finance}")
    private String financeEmail;

    @Value("${app.email.administration}")
    private String administration;

    @Value("${app.url}")
    private String appUrl;

    private EmailTemplateLoader templateLoader = new EmailTemplateLoader();

    @Async
    public void sendTestEmail(String email) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor_name", "Testing");
            placeholders.put("requestor_id", "Testing");
            placeholders.put("mission_id", "Testing");

            String emailBody = templateLoader.loadTemplate(("templates/finance_template.html"), placeholders);
            // String emailBody = templateLoader.loadTemplate("templates/finance_template.html", placeholders);

            // Send the email
            sendEmail(email, "Mission has been approved for your payment", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendAdministrationEmail(MissionDetails missionDetails, List<MissionDestination> missionDestinations) {
        try {
            // Load and populate the email template
            String Link = appUrl + "/travel-clearance?id=" + missionDetails.getReferenceId();
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor_name", missionDetails.getEmployee().getFamilyName() + " "+missionDetails.getEmployee().getGivenName());
            placeholders.put("requestor_id", missionDetails.getEmployee().getEmployeeId());
            placeholders.put("mission_id", missionDetails.getReferenceId());
            placeholders.put("link", Link);

            StringBuilder missionDestinationsHtml = new StringBuilder();
            for (MissionDestination destination : missionDestinations) {
                String location = destination.getDistrict().getDistrictName();
                String dateFrom = destination.getStartDate().toString(); // Format as needed
                String dateTo = destination.getEndDate().toString(); // Format as needed

                missionDestinationsHtml.append("<tr>")
                    .append("<td>").append(location).append("</td>")
                    .append("<td>").append(dateFrom).append("</td>")
                    .append("<td>").append(dateTo).append("</td>")
                    .append("</tr>");
            }

            placeholders.put("mission_destinations", missionDestinationsHtml.toString());

            String emailBody = templateLoader.loadTemplate("templates/administration_template.html", placeholders);

            // Send the email
            sendEmail(administration, "Transport Request for Approved Mission Order", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendMissionRequestEmail(MissionDetails missionDetails,Employee  requestor, Employee employee) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor", requestor.getFamilyName() + " "+requestor.getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());
            placeholders.put("expected_result", missionDetails.getExpectedResults());
            placeholders.put("mission_purpose", missionDetails.getPurposeOfMission());
            placeholders.put("employee_name", employee.getFamilyName() + " " + employee.getGivenName());

            String emailBody = templateLoader.loadTemplate("templates/request_template.html", placeholders);

            // String imagePath = "/backend/static/Assets/RRA_Logo_home.png"; 

            // Send the email
            sendEmail(employee.getWorkEmail(), "New Mission Request", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendFinanceEmail(MissionDetails missionDetails, Employee requestor) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor_name", requestor.getFamilyName() + " "+requestor.getGivenName());
            placeholders.put("requestor_id", requestor.getEmployeeId());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/finance_template.html", placeholders);

            // Send the email
            sendEmail(financeEmail, "Mission has been approved for your payment", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendApprovalEmail(MissionDetails missionDetails, Employee requestor, Employee approver) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor", requestor.getFamilyName() + " "+requestor.getGivenName());
            placeholders.put("approver", approver.getFamilyName() + " "+approver.getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/approve_template.html", placeholders);

            // Send the email
            sendEmail(requestor.getWorkEmail(), "Mission Request Approved", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendRejectionEmail(Employee requestor, MissionDetails missionDetails) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor", requestor.getFamilyName() + " "+requestor.getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/reject_template.html", placeholders);

            sendEmail(requestor.getWorkEmail(), "Mission Order Rejected", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendReturnEmail(Employee requestor, MissionDetails missionDetails) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor", requestor.getFamilyName() + " "+requestor.getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/return_template.html", placeholders);

            sendEmail(requestor.getWorkEmail(), "Mission Order Returned", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendCancelClearanceEmail(Employee requestor, MissionDetails missionDetails) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor", requestor.getFamilyName() + " "+requestor.getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/cancelled_clearance_template.html", placeholders);

            sendEmail(requestor.getWorkEmail(), "Mission Order Cancelled", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendComputationEmail(Employee requestor, MissionDetails missionDetails) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor", requestor.getFamilyName() + " "+requestor.getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/computed_template.html", placeholders);

            sendEmail(requestor.getWorkEmail(), "Mission has been computed", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Async
    public void sendCancelComputationEmail(Employee requestor, MissionDetails missionDetails) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor", requestor.getFamilyName() + " "+requestor.getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/mission_computation_cancelled.html", placeholders);

            sendEmail(requestor.getWorkEmail(), "Mission Computation Cancelled", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendBatchEmail(Employee requestor, MissionDetails missionDetails){
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("requestor", requestor.getFamilyName() + " "+requestor.getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/batch_template.html", placeholders);

            sendEmail(requestor.getWorkEmail(), "Mission Added to PaymentBatch", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendMissionReportedEmail(MissionDetails missionDetails) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("employee", missionDetails.getApprover().getFamilyName() + " "+missionDetails.getApprover().getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/mission_reported_successful.html", placeholders);

            sendEmail(missionDetails.getApprover().getWorkEmail(), "Mission order has been Reported", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendMissionReportedApprovedEmail(MissionDetails missionDetails) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("employee", missionDetails.getEmployee().getFamilyName() + " "+missionDetails.getEmployee().getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/mission_report_approved_successful.html", placeholders);

            sendEmail(missionDetails.getEmployee().getWorkEmail(), "Mission Report Approved Successfully", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendMissionReportRejectedEmail(MissionDetails missionDetails, String message) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("employee", missionDetails.getEmployee().getFamilyName() + " "+missionDetails.getEmployee().getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());
            placeholders.put("message", message);

            String emailBody = templateLoader.loadTemplate("templates/mission_reported_rejected.html", placeholders);

            sendEmail(missionDetails.getEmployee().getWorkEmail(), "Mission Report Rejected Successfully", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendMissionClaimEmail(MissionDetails missionDetails) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/mission_claim.html", placeholders);

            sendEmail(financeEmail, "Mission Refund Claim", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void reportRemainderEmail(MissionDetails missionDetails) {
        try {
            // Load and populate the email template
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("employee", missionDetails.getEmployee().getFamilyName() + " "+missionDetails.getEmployee().getGivenName());
            placeholders.put("mission_id", missionDetails.getReferenceId());

            String emailBody = templateLoader.loadTemplate("templates/report_remainder.html", placeholders);

            sendEmail(missionDetails.getEmployee().getWorkEmail(), "Mission Report remainder", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    


    private void sendEmail(String toEmail, String subject, String body) throws IOException {
        // SMTP properties
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true"); // Ensure STARTTLS is enabled
        properties.put("mail.smtp.host", smtpServer);
        properties.put("mail.smtp.port", smtpPort);
        properties.put("mail.smtp.ssl.trust", smtpServer);
        properties.put("mail.debug", "true");
    
        // Create a session with authentication
        Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
    
        try {
            // Create the email message
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(emailAddress));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject(subject);
    
            // Create a MimeBodyPart for the HTML content
            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setContent(body, "text/html; charset=utf-8");
    
            // Create a MimeBodyPart for the image
            MimeBodyPart imagePart = new MimeBodyPart();
            String imagePath = "/static/Assets/RRA_Logo_home.png";
            InputStream imageStream = getClass().getResourceAsStream(imagePath);
            DataSource fds = new ByteArrayDataSource(imageStream, "image/png"); // Use correct MIME type
            imagePart.setDataHandler(new DataHandler(fds));
            imagePart.setHeader("Content-ID", "<RRA_Logo_home>");
            imagePart.setDisposition(MimeBodyPart.INLINE);
    
            // Create a multipart message
            MimeMultipart multipart = new MimeMultipart("related");
            multipart.addBodyPart(textPart);
            multipart.addBodyPart(imagePart);
            
            
    
            // Set the multipart content to the message
            message.setContent(multipart);
    
            // Send the email
            Transport.send(message);
            System.out.println("Email sent successfully!");
    
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
    
    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink, String expirationTime, String code) {
        try {
            // Use a StringBuilder to create the code with individual boxes
            StringBuilder codeInBoxes = new StringBuilder();
            for (char digit : code.toCharArray()) {
                codeInBoxes.append("<span class='code-box'>")
               .append(digit)
               .append("</span>");
            }
    
            // Load and populate the email template for password reset
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("reset_link", resetLink);
            placeholders.put("expiration_time", expirationTime);
            placeholders.put("code", codeInBoxes.toString());  // Convert StringBuilder to String
    
            // Load the email template from the file system
            String emailBody = templateLoader.loadTemplate("templates/password_reset_template.html", placeholders);
    
            // Send the email            sendEmail(toEmail, "Password Reset Request", emailBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    

    

}
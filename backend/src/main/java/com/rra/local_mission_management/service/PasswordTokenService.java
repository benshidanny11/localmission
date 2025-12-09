package com.rra.local_mission_management.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.PasswordResetToken;
import com.rra.local_mission_management.repository.PasswordResetTokenRepository;

@Service
public class PasswordTokenService {

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.url}")
    private String appUrl;

    public PasswordResetToken generatePasswordResetToken(Employee employee) {
        try {
            // Generate the token and set expiration
            String token = UUID.randomUUID().toString();
            LocalDateTime expirationDateTime = LocalDateTime.now().plusHours(1);  // 1-hour expiration
            String code = String.format("%04d", new Random().nextInt(10000));

            // Create PasswordResetToken entity and save it
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setCode(code);
            resetToken.setEmployee(employee);
            resetToken.setExpiryDate(expirationDateTime);

            passwordResetTokenRepository.save(resetToken);

            // Format the expiration time for the email
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm a");
            String expirationTime = expirationDateTime.format(formatter);

            // Generate reset link
            String resetLink = appUrl + "/reset-password?token=" + token;

            // Send password reset email
            emailService.sendPasswordResetEmail(employee.getWorkEmail(), resetLink, expirationTime, code);
            return resetToken;

        } catch (Exception e) {
            // Handle any exceptions, log the error, and rethrow or take appropriate action
            System.err.println("Error generating password reset token or sending email: " + e.getMessage());
            e.printStackTrace();
            // Optionally, you can rethrow the exception or return some error response to the calling method
        }

        return null;
    }

    public boolean validateToken(String token) {

        Optional<PasswordResetToken> resetToken = passwordResetTokenRepository.findByToken(token);

        if (resetToken.isPresent()) {
            PasswordResetToken tokenEntity = resetToken.get();
            if (tokenEntity.getIsValid() && tokenEntity.getExpiryDate().isAfter(LocalDateTime.now())) {
                passwordResetTokenRepository.invalidateToken(token);
                return true;
            }
        }

        return false;
    }
}

package com.rra.local_mission_management.service;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.Admin;
import com.rra.local_mission_management.entity.PasswordResetToken;
import com.rra.local_mission_management.exception.TokenExpiredException;
import com.rra.local_mission_management.repository.AdminRepository;
import com.rra.local_mission_management.repository.PasswordResetTokenRepository;

@Service
public class PasswordResetService {

    @Autowired PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired 
    private AdminService adminService;

    @Autowired 
    private AdminRepository adminRepository;

    public void resetPassword(String token, String code, String newPassword) {
        Optional<PasswordResetToken> resetTokenOpt = passwordResetTokenRepository.findByToken(token);

        if (!resetTokenOpt.isPresent() || !resetTokenOpt.get().getIsValid() || resetTokenOpt.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Token expired or invalid.");
        }

        PasswordResetToken resetToken = resetTokenOpt.get();

        if (!resetToken.getCode().equals(code)) {
            throw new IllegalArgumentException("Invalid code.");
        }

        Admin admin = adminService.findByUsername(resetToken.getEmployee().getEmployeeId()).get();

        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);

        // Optionally delete the token after password reset
        passwordResetTokenRepository.invalidateAllTokensForUser(Long.parseLong(admin.getEmployeeId()));
        passwordResetTokenRepository.delete(resetToken);
    }
}

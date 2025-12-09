package com.rra.local_mission_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.rra.local_mission_management.entity.PasswordResetToken;

import jakarta.transaction.Transactional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long>{

    Optional<PasswordResetToken> findByToken(String token);
    
    @Modifying
    @Transactional
    @Query("UPDATE PasswordResetToken t SET t.isValid = false WHERE t.employee.id = :employeeId")
    void invalidateAllTokensForUser(Long employeeId);

    @Modifying
    @Transactional
    @Query("UPDATE PasswordResetToken t SET t.isValid = false WHERE t.token = :token")
    void invalidateToken(String token);
}

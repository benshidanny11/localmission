package com.rra.local_mission_management.repository;

import org.springframework.stereotype.Repository;

import com.rra.local_mission_management.entity.Grade;
import com.rra.local_mission_management.entity.MissionAllowance;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface MissionAllowanceRepo extends JpaRepository<MissionAllowance, Long> {
    Optional<MissionAllowance> findByGradeAndEndDateIsNull(Grade grade);
}
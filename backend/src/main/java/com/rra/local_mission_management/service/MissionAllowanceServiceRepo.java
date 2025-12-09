package com.rra.local_mission_management.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.Grade;
import com.rra.local_mission_management.entity.MissionAllowance;
import com.rra.local_mission_management.repository.MissionAllowanceRepo;

@Service
public class MissionAllowanceServiceRepo {
    @Autowired
    private MissionAllowanceRepo missionAllowanceRepo;

    public Optional<MissionAllowance> getAllowanceByGrade(Grade grade) {
        return missionAllowanceRepo.findByGradeAndEndDateIsNull(grade);
    }
}

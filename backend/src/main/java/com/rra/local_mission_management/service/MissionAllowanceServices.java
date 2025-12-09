package com.rra.local_mission_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.repository.MissionAllowanceRepository;

@Service
public class MissionAllowanceServices {
     @Autowired
    private MissionAllowanceRepository missionAllowanceRepository;

    public Object calculateAllowance(String employeeId, String missionDetailsJson) {
        return missionAllowanceRepository.calculateAllowance(employeeId, missionDetailsJson);
    }
}

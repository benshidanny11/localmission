package com.rra.local_mission_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.MissionDestination;
import com.rra.local_mission_management.repository.MissionDestinationRepository;

@Service
public class MissionDestinationService {
    @Autowired
    private MissionDestinationRepository missionDestinationRepository;

    public List<MissionDestination> getAllMissionDestinationes() {
        return missionDestinationRepository.findAll();
    }

    public Optional<MissionDestination> getMissionDestinationById(Long id) {
        return missionDestinationRepository.findById(id);
    }

    public MissionDestination saveMissionDestination(MissionDestination MissionDestination) {
        return missionDestinationRepository.save(MissionDestination);
    }

    public void deleteMissionDestination(Long id) {
        missionDestinationRepository.deleteById(id);
    }
}

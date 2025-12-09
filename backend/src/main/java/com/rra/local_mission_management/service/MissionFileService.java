package com.rra.local_mission_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.MissionFile;
import com.rra.local_mission_management.repository.MissionFileRepository;

@Service
public class MissionFileService {
    @Autowired
    private MissionFileRepository missionFileRepository;

    public List<MissionFile> getAllMissionFilees() {
        return missionFileRepository.findAll();
    }

    public MissionFile saveMissionFile(MissionFile missionFile) {
        return missionFileRepository.save(missionFile);
    }

    public Optional<MissionFile> getMissionFileById(Long id) {
        return missionFileRepository.findById(id);
    }

    public void deleteMissionFile(Long id) {
        missionFileRepository.deleteById(id);
    }
}

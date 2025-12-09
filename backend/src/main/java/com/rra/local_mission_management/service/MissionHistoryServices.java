package com.rra.local_mission_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.MissionDetails;
import com.rra.local_mission_management.entity.MissionHistoryRecord;
import com.rra.local_mission_management.repository.MissionHistoryRepository;


@Service
public class MissionHistoryServices {

     @Autowired
    private MissionHistoryRepository missionHistoryRepository;

    public List<MissionHistoryRecord> getAllMissionAllowance() {
        return missionHistoryRepository.findAll();
    }

    public Optional<MissionHistoryRecord> getMissionAllowanceById(Long id) {
        return missionHistoryRepository.findById(id);
    }

    public MissionHistoryRecord saveBankDetail(MissionHistoryRecord history) {
        return  missionHistoryRepository.save(history);
    }

    public void deleteHistoryRecord(Long id) {
        missionHistoryRepository.deleteById(id);
    }

    public List<MissionHistoryRecord> getByHistoryRecordsByMissionDetails(MissionDetails missionDetails) {
        return missionHistoryRepository.findByMissionDetailsOrderByCreatedAtDesc(missionDetails);
    }
}

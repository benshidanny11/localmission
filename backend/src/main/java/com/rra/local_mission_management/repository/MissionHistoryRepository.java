package com.rra.local_mission_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rra.local_mission_management.entity.MissionDetails;
import com.rra.local_mission_management.entity.MissionHistoryRecord;

@Repository
public interface MissionHistoryRepository extends JpaRepository<MissionHistoryRecord, Long> {
    List<MissionHistoryRecord> findByMissionDetailsOrderByCreatedAtDesc(MissionDetails missionDetails);
}

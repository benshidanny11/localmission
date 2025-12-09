package com.rra.local_mission_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rra.local_mission_management.entity.MissionFile;

@Repository
public interface MissionFileRepository extends JpaRepository<MissionFile, Long>{
    Optional<MissionFile> findByMissionDetailsId(Long missionDetailsId);
}

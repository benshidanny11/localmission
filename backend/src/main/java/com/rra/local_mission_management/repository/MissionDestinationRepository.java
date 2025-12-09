package com.rra.local_mission_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rra.local_mission_management.entity.MissionDestination;

@Repository
public interface MissionDestinationRepository extends JpaRepository<MissionDestination, Long>{

    
}
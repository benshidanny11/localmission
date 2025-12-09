package com.rra.local_mission_management.repository;

import com.rra.local_mission_management.entity.JobMaster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobMasterRepository extends JpaRepository<JobMaster, Integer>{
    
}

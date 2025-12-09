package com.rra.local_mission_management.repository;

import com.rra.local_mission_management.entity.Sequence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SequenceRepository extends JpaRepository<Sequence, Long> {
    Optional<Sequence> findByFiscalYear(String fiscalYear);
}

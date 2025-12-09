package com.rra.local_mission_management.repository;

import com.rra.local_mission_management.entity.Structure;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface StructureRepository extends CrudRepository<Structure, Integer> {

    @Query("SELECT s2 FROM Structure s1 JOIN Structure s2 ON s1.referenceId = s2.structureId WHERE s1.structureId = :structureId")
    Structure findStructuresByReferenceId(int structureId);
}

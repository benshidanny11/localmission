package com.rra.local_mission_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.Structure;
import com.rra.local_mission_management.repository.StructureRepository;

@Service
public class StructureService {

    @Autowired
    private StructureRepository structureRepository;

    public Structure getReferencedStructureByStructureId(int structureId) {
        if(structureId == 3) {
            return structureRepository.findById(structureId).get();
        }else {
            return structureRepository.findStructuresByReferenceId(structureId);
        }
    }
}

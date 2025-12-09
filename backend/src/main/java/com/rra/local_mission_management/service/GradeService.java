package com.rra.local_mission_management.service;

import com.rra.local_mission_management.entity.Grade;
import com.rra.local_mission_management.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    public Optional<Grade> getGradeById(int gradeId) {
        return gradeRepository.findById(gradeId);
    }
}
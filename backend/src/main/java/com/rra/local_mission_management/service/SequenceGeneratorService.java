package com.rra.local_mission_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.Sequence;
import com.rra.local_mission_management.repository.SequenceRepository;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class SequenceGeneratorService {

    @Autowired
    private SequenceRepository sequenceRepository;

    @Transactional
    public String generateReferenceId() {
        LocalDate now = LocalDate.now();
        String fiscalYear = getFiscalYear(now);
        
        Optional<Sequence> sequenceOptional = sequenceRepository.findByFiscalYear(fiscalYear);
        Sequence sequence = sequenceOptional.orElseGet(() -> {
            Sequence newSequence = new Sequence();
            newSequence.setFiscalYear(fiscalYear);
            newSequence.setSequenceNumber(0);
            return newSequence;
        });

        sequence.setSequenceNumber(sequence.getSequenceNumber() + 1);
        sequenceRepository.save(sequence);

        return String.format("%06d/%s", sequence.getSequenceNumber(), fiscalYear.substring(2));
    }

    private String getFiscalYear(LocalDate date) {
        int year = date.getYear();
        if (date.getMonthValue() < 7) {
            year--;
        }
        return String.format("%d%02d", year % 100, (year + 1) % 100);
    }
}

package com.rra.local_mission_management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.dto.request.PaymentBatchDTO;
import com.rra.local_mission_management.dto.request.PaymentBatchRequest;
import com.rra.local_mission_management.entity.MissionPaymentBatch;
import com.rra.local_mission_management.enums.BatchStatus;
import com.rra.local_mission_management.exception.ResourceNotFoundException;
import com.rra.local_mission_management.repository.MissionPaymentBatchRepository;

@Service
public class MissionPaymentBatchServices {

    @Autowired
    private MissionPaymentBatchRepository missionPaymentBatchRepository;

    public List<MissionPaymentBatch> getAllMissionPaymentBatches() {
        return missionPaymentBatchRepository.findAllOrderBySnDesc();
    }

    public MissionPaymentBatch getMissionPaymentBatchBySn(String sn) {
        return missionPaymentBatchRepository.findBySn(sn);
    }

    // public Optional<MissionPaymentBatch> getMissionPaymentBatchById(String id) {
    //     return missionPaymentBatchRepository.findById(id);
    // }

    public List<PaymentBatchRequest> getFirstMissionPaymentBatches() {
        return missionPaymentBatchRepository.findAllBatchDetails();
    }

    public List<PaymentBatchDTO> getSecondMissionPaymentBatches() {
        return missionPaymentBatchRepository.findBatchDetails();
    }

    
    public String generateCustomId() {
        int lastSnNumber = missionPaymentBatchRepository.findLatestBatchNumber();
        return "MPBatch" + String.format("%06d", lastSnNumber + 1);
    }

    public MissionPaymentBatch saveMissionPaymentBatch(MissionPaymentBatch missionPaymentBatch) {
        String generatedId = generateCustomId();
        missionPaymentBatch.setSn(generatedId);
        return missionPaymentBatchRepository.save(missionPaymentBatch);
    }

     public MissionPaymentBatch cancelPaymentBatch(String sn) {
        MissionPaymentBatch batch = missionPaymentBatchRepository.findById(sn)
            .orElseThrow(() -> new ResourceNotFoundException("Batch not found with sn: " + sn));

        batch.setStatus(BatchStatus.CANCELLED.getStatus()); // Set status to CANCELLED
        return missionPaymentBatchRepository.save(batch); // Save the updated batch
    }

}

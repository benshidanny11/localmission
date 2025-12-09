package com.rra.local_mission_management.dto.responce;

import java.util.List;

import com.rra.local_mission_management.entity.MissionPaymentBatch;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetAllBatch {
    String message;
    List<MissionPaymentBatch> data;
}

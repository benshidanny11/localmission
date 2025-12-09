package com.rra.local_mission_management.dto.responce;

import com.rra.local_mission_management.entity.MissionPaymentBatch;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class PaymentBatchResponse {

    String message;
    MissionPaymentBatch data;
    
}

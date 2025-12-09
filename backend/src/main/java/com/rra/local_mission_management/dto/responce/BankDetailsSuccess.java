package com.rra.local_mission_management.dto.responce;


import com.rra.local_mission_management.entity.BankDetails;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BankDetailsSuccess {
    private String message;
    private BankDetails data;

    
}
package com.rra.local_mission_management.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rra.local_mission_management.dto.request.MissionAllowanceDTO;
import com.rra.local_mission_management.dto.request.MissionAllowanceDistrictDTO;
import com.rra.local_mission_management.dto.responce.MissionAllowanceDataResponse;
import com.rra.local_mission_management.dto.responce.MissionAllowanceResponse;
import com.rra.local_mission_management.service.MissionAllowanceServices;

@RestController
@RequestMapping("/api/v1/mission-allowance")
public class MissionAllowanceController {
    @Autowired
    private MissionAllowanceServices missionAllowanceService;

    @PostMapping("/calculate")
    public ResponseEntity<?> calculateAllowance(@RequestBody MissionAllowanceDTO missionAllowance) {

        try {
            String missionAllowanceJson = convertToJson(missionAllowance.getMissionAllowance());
            Object result = missionAllowanceService.calculateAllowance(missionAllowance.getEmployeeId(), missionAllowanceJson);

            return new ResponseEntity<>(new MissionAllowanceResponse(
                "success", 
                new MissionAllowanceDataResponse(
                    missionAllowance.getEmployeeId(),
                    result)
                ), 
                HttpStatus.OK
            );

        } catch (Exception e) {
            return new ResponseEntity<>("Error calculating allowance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String convertToJson(List<MissionAllowanceDistrictDTO> missionAllowance) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(missionAllowance);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert mission details to JSON", e);
        }
    }
}

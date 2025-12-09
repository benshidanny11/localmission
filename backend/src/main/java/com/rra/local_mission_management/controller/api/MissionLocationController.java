package com.rra.local_mission_management.controller.api;

import org.springframework.web.bind.annotation.RestController;

import com.rra.local_mission_management.dto.responce.ApiResponse;
import com.rra.local_mission_management.dto.responce.MissionLocationResponce;
import com.rra.local_mission_management.entity.MissionLocation;
import com.rra.local_mission_management.service.MissionLocationService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;




@RestController
@RequestMapping("api/v1/mission-location")
public class MissionLocationController {

    @Autowired
    private MissionLocationService missionLocationService;

    @GetMapping
    public ResponseEntity<?> getMissionLocations() {
        MissionLocationResponce missionLocationResponce = new MissionLocationResponce();
        List<MissionLocation> missionLocations = missionLocationService.getAllMissionLocationes();

        missionLocationResponce.setMessage("Success");
        missionLocationResponce.setData(missionLocations);
        return new ResponseEntity<>(missionLocationResponce, HttpStatus.OK);
    }    

    @GetMapping("/{id}")
    public ResponseEntity<?> getMissionLocationById(@PathVariable int id) {
        Optional<MissionLocation> missionLocation = missionLocationService.getMissionLocationsByDistrictId(id);

        if(missionLocation.isPresent()){
            return ResponseEntity.ok(missionLocation.get());
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse("Mission location not found", 404));
        }
    }
    
    
}

package com.rra.local_mission_management.controller.api;

import com.rra.local_mission_management.dto.responce.ApiResponse;
import com.rra.local_mission_management.entity.District;
import com.rra.local_mission_management.service.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/districts")
public class DistrictController {

    @Autowired
    private DistrictService districtService;

    // Get all districts
    @GetMapping("")
    public List<District> getAllDistricts() {
        return districtService.getAllDistricts();
    }

    // Get district by district code
    @GetMapping("/code/{districtCode}")
    public ResponseEntity<?> getDistrictByCode(@PathVariable int districtCode) {
        Optional<District> district = districtService.getDistrictByCode(districtCode);
        if (district.isPresent()) {
            return ResponseEntity.ok(district.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse("District not found", 404));
        }
    }

    // Get districts by district name
    @GetMapping("/name/{districtName}")
    public ResponseEntity<?> getDistrictsByName(@PathVariable String districtName) {
        List<District> districts = districtService.getDistrictsByName(districtName);
        if (districts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse("No districts found with the given name", 404));
        }
        return ResponseEntity.ok(districts);
    }

    // Get districts by district code or district name
    @GetMapping("/search")
    public ResponseEntity<?> getDistrictsByCodeOrName(@RequestParam int districtCode,
                                                      @RequestParam String districtName) {
        List<District> districts = districtService.getDistrictsByCodeOrName(districtCode, districtName);
        if (districts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse("No districts found with the given code or name", 404));
        }
        return ResponseEntity.ok(districts);
    }

    // Get districts by province code
    @GetMapping("/province/{provinceCode}")
    public ResponseEntity<?> getDistrictsByProvinceCode(@PathVariable int provinceCode) {
        List<District> districts = districtService.getDistrictsByProvinceCode(provinceCode);
        if (districts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse("No districts found with the given province code", 404));
        }
        return ResponseEntity.ok(districts);
    }
}

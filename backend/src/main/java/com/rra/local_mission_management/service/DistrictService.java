package com.rra.local_mission_management.service;

import com.rra.local_mission_management.entity.District;
import com.rra.local_mission_management.repository.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DistrictService {

    @Autowired
    private DistrictRepository districtRepository;

    // Get all districts
    public List<District> getAllDistricts() {
        return districtRepository.findAll();
    }

    // Get district by district code
    public Optional<District> getDistrictByCode(int districtCode) {
        return districtRepository.findByDistrictCode(districtCode);
    }

    // Get districts by district name
    public List<District> getDistrictsByName(String districtName) {
        return districtRepository.findByDistrictNameContainingIgnoreCase(districtName);
    }

    public Optional<District> getDistrictByName(String districtName) {
        return districtRepository.findByDistrictNameIgnoreCase(districtName);
    }

    // Get districts by district code or district name
    public List<District> getDistrictsByCodeOrName(int districtCode, String districtName) {
        return districtRepository.findByDistrictCodeOrDistrictNameContainingIgnoreCase(districtCode, districtName);
    }

    // Get districts by province code
    public List<District> getDistrictsByProvinceCode(int provinceCode) {
        return districtRepository.findByProvinceCode(provinceCode);
    }
}

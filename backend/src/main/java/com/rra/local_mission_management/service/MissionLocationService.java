package com.rra.local_mission_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.entity.District;
import com.rra.local_mission_management.entity.MissionLocation;
import com.rra.local_mission_management.repository.MissionLocationRepository;

@Service
public class MissionLocationService {
    @Autowired
    private MissionLocationRepository missionLocationRepository;

    @Autowired
    private DistrictService districtService;

    public List<MissionLocation> getAllMissionLocationes() {
        return missionLocationRepository.findByEndDateIsNull().get();
    }

    public Optional<MissionLocation> getMissionLocationById(Long id) {
        return missionLocationRepository.findById(id);
    }

    public Optional<District> getDistrictByName(String districtName) {
        return districtService.getDistrictByName(districtName);
    }

    public MissionLocation saveMissionLocation(MissionLocation MissionLocation) {
        return missionLocationRepository.save(MissionLocation);
    }

    public void deleteMissionLocation(Long id) {
        missionLocationRepository.deleteById(id);
    }

    public Optional<MissionLocation> getMissionLocationsByDistrictId(int districtId) {
        return missionLocationRepository.findByDistrict_DistrictCodeAndEndDateIsNull(districtId);
    }
}

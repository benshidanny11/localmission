package com.rra.local_mission_management.repository;

import com.rra.local_mission_management.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DistrictRepository extends JpaRepository<District, Integer> {

    // Get all districts (inherited from JpaRepository)

    // Get district by district code
    Optional<District> findByDistrictCode(int districtCode);

    // Get districts by district name (ignoring case)
    List<District> findByDistrictNameContainingIgnoreCase(String districtName);

    // Get districts by district code or district name (ignoring case)
    List<District> findByDistrictCodeOrDistrictNameContainingIgnoreCase(int districtCode, String districtName);

    // Get districts by province code
    List<District> findByProvinceCode(int provinceCode);

    Optional<District> findByDistrictNameIgnoreCase(String districtName);
}

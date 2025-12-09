package com.rra.local_mission_management.repository;

import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.PlacementsStructureMap;
import com.rra.local_mission_management.entity.Structure;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PlacementsStructureMapRepository extends CrudRepository<PlacementsStructureMap, Integer> {

    @Query("SELECT p.structure FROM PlacementsStructureMap p WHERE p.employee = :employee")
    Structure findStructureByEmployee(@Param("employee") Employee employee);


    @Query("SELECT p.structure FROM PlacementsStructureMap p WHERE p.employee.employeeId = :employeeId")
    Structure findStructureByEmployeeId(@Param("employee") String employeeId);

    PlacementsStructureMap findByEmployee_EmployeeId(String employeeId);

    List<PlacementsStructureMap> findByStructure(Structure structure);
}

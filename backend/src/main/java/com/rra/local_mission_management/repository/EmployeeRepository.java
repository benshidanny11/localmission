package com.rra.local_mission_management.repository;

import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.Placement;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
     @Query("SELECT e FROM Employee e WHERE e.employeeId = :searchTerm OR e.givenName LIKE %:searchTerm% OR e.familyName LIKE %:searchTerm%")
    List<Employee> findByEmployeeIdOrName(@Param("searchTerm") String searchTerm);

    @Query("SELECT e FROM Employee e WHERE e.currentJob.jobTitle = :jobTitle")
    List<Employee> findByJobTitle(@Param("jobTitle") String jobTitle);

    @Query("SELECT e FROM Employee e WHERE LOWER(e.department.departmentName) LIKE LOWER(CONCAT('%', :department, '%'))")
    List<Employee> findByDepartmentName(String department);

    @Query("SELECT e FROM Employee e WHERE e.department.departmentId = :departmentId")
    List<Employee> findByDepartmentId(int departmentId);

    @Query("SELECT e FROM Employee e WHERE e.workEmail = :email OR e.personalEmail = :email")
    Optional<Employee> findByEmail(@Param("email") String email);

    Optional<Employee> findFirstByWorkEmailOrPersonalEmail(String workEmail, String personalEmail);

    @Query("SELECT e FROM Employee e JOIN PlacementsStructureMap p ON e.employeeId = p.employee.employeeId WHERE p.structure.structureId = :structureId")
    List<Employee> findEmployeesByStructureId(int structureId);

    @Query("SELECT p.structure.structureId FROM PlacementsStructureMap p WHERE p.employee.employeeId = :employeeId")
    Integer findStructureIdByEmployeeId(String employeeId);

    @Query("SELECT e FROM Employee e " +
       "JOIN PlacementsStructureMap p ON e.employeeId = p.employee.employeeId " +
       "WHERE p.structure.structureId = (SELECT ps.structure.structureId " +
       "                                  FROM PlacementsStructureMap ps " +
       "                                  WHERE ps.employee.employeeId = :employeeId)")
    List<Employee> findEmployeesInSameStructureByEmployeeId(String employeeId);


    @Query("SELECT plc FROM Placement plc " +
       "JOIN PlacementsStructureMap p ON plc.employee = p.employee " +
       "WHERE p.structure.structureId = (SELECT ps.structure.structureId " +
       "                                  FROM PlacementsStructureMap ps " +
       "                                  WHERE ps.employee.employeeId = :employeeId)")
    List<Placement> findPlacementsInSameStructureByEmployeeId(String employeeId);


}
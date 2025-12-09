package com.rra.local_mission_management.repository;

import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.Grade;
import com.rra.local_mission_management.entity.Placement;
import com.rra.local_mission_management.entity.Structure;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface PlacementRepository extends CrudRepository<Placement, Integer> {

    @Query("SELECT p.jobMaster.gradeId FROM Placement p WHERE p.employee.employeeId = :employeeId")
    Grade findGradeByEmployeeId(int employeeId);

    @Query("SELECT p.employee FROM Placement p " +
           "JOIN p.jobMaster jm " +
           "JOIN jm.gradeId g " +
           "WHERE p.structure = :structure " +
           "AND g.shortName IN :shortNames ")
    List<Employee> findEmployeesByStructureAndGradeShortNameIn(Structure structure, List<String> shortNames);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END " +
           "FROM Placement p " +
           "JOIN p.jobMaster jm " +
           "JOIN jm.gradeId g " +
           "WHERE p.employee = :employee " +
           "AND g.shortName IN :shortNames")
    boolean existsPlacementWithGradeShortNameIn(@Param("employee") Employee employee, @Param("shortNames") List<String> shortNames);

    Placement findByEmployee_EmployeeId(String employeeId);

    @Query("SELECT p.employee FROM Placement p " +
           "JOIN p.jobMaster jm " +
           "JOIN jm.gradeId g " +
           "WHERE g.shortName IN :shortNames ")
    List<Employee> findEmployeesByGradeShortNameIn(List<String> shortNames);

    Optional<Placement> findByEmployee(Employee employee);

    List<Placement> findByEmployeeIn(List<Employee> employees);

    @Query("SELECT ps.employee FROM PlacementsStructureMap ps " +
           "JOIN Placement p ON ps.employee = p.employee " +
           "JOIN JobMaster j ON p.jobMaster = j " +
           "WHERE ps.structure = :structure " +
           "AND j.gradeId.shortName IN :shortNames")
    List<Employee> findEmployeesByStructureAndGradeShortNames(
            @Param("structure") Structure structure, 
            @Param("shortNames") List<String> shortNames);
}

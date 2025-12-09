package com.rra.local_mission_management.service;

import com.rra.local_mission_management.dto.request.GradeDTO;
import com.rra.local_mission_management.dto.request.JobMasterDTO;
import com.rra.local_mission_management.dto.request.PlacementDTO;
import com.rra.local_mission_management.dto.request.StructureDTO;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.Grade;
import com.rra.local_mission_management.entity.JobMaster;
import com.rra.local_mission_management.entity.Placement;
import com.rra.local_mission_management.entity.PlacementsStructureMap;
import com.rra.local_mission_management.entity.Structure;
import com.rra.local_mission_management.repository.PlacementRepository;
import com.rra.local_mission_management.repository.PlacementsStructureMapRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlacementService {

    private final PlacementRepository placementRepository;
    private final PlacementsStructureMapRepository placementsStructureMapRepository;

    @Autowired
    public PlacementService(PlacementRepository placementRepository, PlacementsStructureMapRepository placementsStructureMapRepository) {
        this.placementRepository = placementRepository;
        this.placementsStructureMapRepository = placementsStructureMapRepository;
    }
    
    public Grade findGradeByEmployeeId(int employeeId) {
        return placementRepository.findGradeByEmployeeId(employeeId);
    }
    
    public List<Employee> findEmployeesByStructureAndGradeShortNameIn(Structure structure, List<String> shortNames) {
        return placementRepository.findEmployeesByStructureAndGradeShortNameIn(structure, shortNames);
    }

    public Placement findByEmployee_EmployeeId(String employeeId) {
        return placementRepository.findByEmployee_EmployeeId(employeeId);
    }

    public PlacementDTO getStructureWithJobMasterAndGradeByEmployeeId(String employeeId) {
        try {
    
            Placement placement = placementRepository.findByEmployee_EmployeeId(employeeId);
            
            if (placement == null) {
                return null;
            }
;
            PlacementsStructureMap placementsStructureMap = placementsStructureMapRepository.findByEmployee_EmployeeId(employeeId);
            StructureDTO structureDTO;
            
            if(placementsStructureMap != null && placementsStructureMap.getStructure() != null && placementsStructureMap.getStructure().getStructureName() != null && placementsStructureMap.getStructure().getStructureName() != "") {

                structureDTO = new StructureDTO(
                    placementsStructureMap.getStructure().getStructureId(),
                    placementsStructureMap.getStructure().getStructureName(),
                    placementsStructureMap.getStructure().getStructureType()
                );

            } else {

                Structure structure = placement.getStructure();
                structureDTO = new StructureDTO(
                    structure.getStructureId(),
                    structure.getStructureName(),
                    structure.getStructureType()
                );
                
            }

            JobMaster jobMaster = placement.getJobMaster();
            Grade grade = jobMaster.getGradeId();
            GradeDTO gradeDTO = new GradeDTO(grade.getGradeId(), grade.getGradeName(), grade.getShortName());
    
            JobMasterDTO jobMasterDTO = new JobMasterDTO(jobMaster.getJobMasterId(), jobMaster.getJobTitle(), gradeDTO);
    
            return new PlacementDTO(structureDTO, jobMasterDTO);
    
        } catch (Exception e) {
            return null;
        }
    }

    public PlacementDTO getStructureWithJobMasterAndGradeByEmployee(Employee employee) {
        try {
    
            Placement placement = placementRepository.findByEmployee_EmployeeId(employee.getEmployeeId());
            
            if (placement == null) {
                return null;
            }
;
            Structure placementsStructureMap = placementsStructureMapRepository.findStructureByEmployee(employee);
            StructureDTO structureDTO;
            
            if(placementsStructureMap != null && placementsStructureMap.getStructureName() != null && placementsStructureMap.getStructureName() != "") {

                structureDTO = new StructureDTO(
                    placementsStructureMap.getStructureId(),
                    placementsStructureMap.getStructureName(),
                    placementsStructureMap.getStructureType()
                );

            } else {

                Structure structure = placement.getStructure();
                structureDTO = new StructureDTO(
                    structure.getStructureId(),
                    structure.getStructureName(),
                    structure.getStructureType()
                );
                
            }

            JobMaster jobMaster = placement.getJobMaster();
            Grade grade = jobMaster.getGradeId();
            GradeDTO gradeDTO = new GradeDTO(grade.getGradeId(), grade.getGradeName(), grade.getShortName());
    
            JobMasterDTO jobMasterDTO = new JobMasterDTO(jobMaster.getJobMasterId(), jobMaster.getJobTitle(), gradeDTO);
    
            return new PlacementDTO(structureDTO, jobMasterDTO);
    
        } catch (Exception e) {
            return null;
        }
    }

    public Placement place(String employeeId) {
        try {
    
            Placement placement = placementRepository.findByEmployee_EmployeeId(employeeId);
            
            return placement;
    
        } catch (Exception e) {
            return null;
        }
    }

    public PlacementsStructureMap placeMap(String employeeId) {
        try {
    
            PlacementsStructureMap placementsStructureMap = placementsStructureMapRepository.findByEmployee_EmployeeId(employeeId);
            
            return placementsStructureMap;
    
        } catch (Exception e) {
            return null;
        }
    }

    public List<Employee> findEmployeesByGradeShortNameIn() {
        try {
            List<String> shortNames = Arrays.asList("E1", "E2", "E3", "M3", "M2", "M1");
            return placementRepository.findEmployeesByGradeShortNameIn(shortNames);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public List<Employee> findEmployeesByGradeShortNameInBy(List<String> shortNames) {
        try {
            return placementRepository.findEmployeesByGradeShortNameIn(shortNames);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public Optional<Placement> findByEmployee(Employee employee) {
        try {
            return  placementRepository.findByEmployee(employee);
        } catch (Exception e) {
            return null;
        }
    }

    public List<Employee> findEmployeesTOApprove(Structure structure, List<String> shortNames) {
        try {
            List<Employee> employees = placementRepository.findEmployeesByStructureAndGradeShortNames(structure, shortNames);

            if (employees.isEmpty()) {
                return this.findEmployeesByGradeShortNameInBy(Arrays.asList("E1", "E2", "E3", "M3"));
            }

            return employees;

        } catch (Exception e) {
            return this.findEmployeesByGradeShortNameInBy(Arrays.asList("E1", "E2", "E3", "M3"));
        }
    }
    
}

package com.rra.local_mission_management.service;


import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.dto.request.PlacementDTO;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.Placement;
import com.rra.local_mission_management.entity.Structure;
import com.rra.local_mission_management.repository.EmployeeRepository;
import com.rra.local_mission_management.repository.PlacementRepository;
import com.rra.local_mission_management.repository.PlacementsStructureMapRepository;

@Service
public class ApprovalService {

    private final PlacementRepository placementRepository;
    private final EmployeeRepository employeeRepository;
    private final StructureService structureService;
    private final PlacementsStructureMapRepository placementsStructureMapRepository;

    @Autowired
    private PlacementService placementService;

    @Autowired
    public ApprovalService(PlacementRepository placementRepository,
                           EmployeeRepository employeeRepository,
                           StructureService structureService,
                           PlacementsStructureMapRepository placementsStructureMapRepository) {
        this.placementRepository = placementRepository;
        this.employeeRepository = employeeRepository;
        this.structureService = structureService;
        this.placementsStructureMapRepository = placementsStructureMapRepository;
    }

    public List<Employee> getApprovers(String employeeId) {


        try {

            Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);

            if (!employeeOpt.isPresent()) {
                return new ArrayList<>();
            }

            Structure structure;
            Optional<Placement> placementEmpl =  placementService.findByEmployee(employeeOpt.get());

            if(!placementEmpl.isPresent()) {
                return new ArrayList<>();
            }

            Placement placement = placementEmpl.get();

            Structure employeeStructure = placementsStructureMapRepository.findStructureByEmployee(employeeOpt.get());

            List<Employee> approvals;

            if (employeeStructure != null) {
                structure = employeeStructure;
            } else {
                structure = placement.getStructure();
            }

            if(structure.getStructureId() == 3) {

                if(placement.getJobMaster().getGradeId().getShortName().equals("E3")){
                    approvals = placementService.findEmployeesByGradeShortNameInBy(Arrays.asList("E2"));
                }else if(placement.getJobMaster().getGradeId().getShortName().equals("M3")){
                    approvals = placementService.findEmployeesByGradeShortNameInBy(Arrays.asList("E3"));
                } else {
                    approvals = placementService.findEmployeesTOApprove(structure, Arrays.asList("E3", "M3"));
                }

            } else if(structure.getStructureId() == 4) {

                if(placement.getJobMaster().getGradeId().getShortName().equals("E2")){
                    approvals = placementService.findEmployeesByGradeShortNameInBy(Arrays.asList("E3"));
                } else {
                    approvals = placementService.findEmployeesByGradeShortNameInBy(Arrays.asList("E2"));
                }

            } else if(structure.getStructureId() == 5 || structure.getStructureId() == 6 || structure.getStructureId() == 7 || structure.getStructureId() == 8) {

                if(placement.getJobMaster().getGradeId().getShortName().equals("E1") || placement.getJobMaster().getGradeId().getShortName().equals("M3")){
                    approvals = placementService.findEmployeesByGradeShortNameInBy(Arrays.asList("E2", "E3"));
                } else {
                    approvals = placementService.findEmployeesTOApprove(structure, Arrays.asList("E1", "M3"));
                }

            } else if(structure.getStructureId() == 10 || structure.getStructureId() == 11) {

                if(placement.getJobMaster().getGradeId().getShortName().equals("M3")){
                    approvals = placementService.findEmployeesByGradeShortNameInBy(Arrays.asList("E2", "E3"));
                } else {
                    approvals = placementService.findEmployeesTOApprove(structure, Arrays.asList("M3"));
                }

            } else if(structure.getStructureId() == 13 || structure.getStructureId() == 14 || structure.getStructureId() == 15) {

                if(placement.getJobMaster().getGradeId().getShortName().equals("E1") || placement.getJobMaster().getGradeId().getShortName().equals("M3")){
                    approvals = placementService.findEmployeesByGradeShortNameInBy(Arrays.asList("E2", "E3"));
                } else {
                    approvals = placementService.findEmployeesTOApprove(structure ,Arrays.asList("M3", "E1"));
                }

            }  else if(structure.getStructureId() == 16 || structure.getStructureId() == 17) {

                if(placement.getJobMaster().getGradeId().getShortName().equals("M3")){
                    approvals = placementService.findEmployeesByGradeShortNameInBy(Arrays.asList("E2", "E3"));
                } else {
                    approvals = placementService.findEmployeesTOApprove(structure, Arrays.asList("M3"));
                }

            } else {
                approvals = placementService.findEmployeesByGradeShortNameInBy(Arrays.asList("E1", "E2", "E3", "M3"));
            }

            return approvals;
            
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

}

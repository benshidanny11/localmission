package com.rra.local_mission_management.controller.api;

import com.rra.local_mission_management.dto.request.GradeDTO;
import com.rra.local_mission_management.dto.request.JobMasterDTO;
import com.rra.local_mission_management.dto.request.PlacementDTO;
import com.rra.local_mission_management.dto.request.StructureDTO;
import com.rra.local_mission_management.dto.responce.ApiResponse;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.Placement;
import com.rra.local_mission_management.service.ApprovalService;
import com.rra.local_mission_management.service.EmployeeService;
import com.rra.local_mission_management.service.PlacementService;

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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ApprovalService approvalService;

    @Autowired
    private PlacementService placementService;

    @GetMapping("")
    public ResponseEntity<?> getEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        if (employees.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiResponse("No employees found", 404));
        }
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchEmployees(@RequestParam String searchTerm) {
        List<Employee> employees = employeeService.searchEmployees(searchTerm);
        if (employees.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiResponse("No employees found for the given search term", 404));
        }
        for (Employee employee : employees) {
            PlacementDTO placement = placementService.getStructureWithJobMasterAndGradeByEmployeeId(employee.getEmployeeId());
            employee.setPlacement(placement);
        }
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/department/{id}")
    public ResponseEntity<?> searchEmployeesByDepartment(@PathVariable String id) {
        List<Employee> employees; 
        // employees = employeeService.getEmployeesInSameStructureByEmployeeIdV2(id);
        List<Placement> placementsEmpl = employeeService.getEmployeesInSameStructureByEmployeeIdV3(id);

        employees = placementsEmpl.stream().map(placement -> {
        Employee employee = placement.getEmployee();
        
        // Map the structure and jobMaster from the placement to PlacementDTO
        PlacementDTO placementDTO = new PlacementDTO(
            new StructureDTO(placement.getStructure().getStructureId(), placement.getStructure().getStructureName(), placement.getStructure().getStructureType()),
            new JobMasterDTO(placement.getJobMaster().getJobMasterId(), placement.getJobMaster().getJobTitle(),
            new GradeDTO(placement.getJobMaster().getGradeId().getGradeId(), placement.getJobMaster().getGradeId().getGradeName(), placement.getJobMaster().getGradeId().getShortName()))
        );
        
        employee.setPlacement(placementDTO);

        return employee;
    }).collect(Collectors.toList());


        if (employees.isEmpty()) {
            employees = employeeService.searchEmployees(id);

            if (employees.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse("No employees found for the given Department ID", 404));
            }
        }

        // for (Employee employee : employees) {
        //     PlacementDTO placement = placementService.getStructureWithJobMasterAndGradeByEmployeeId(employee.getEmployeeId());
        //     employee.setPlacement(placement);
        // }
        return ResponseEntity.ok(employees);

    }

    @GetMapping("/approval")
    public ResponseEntity<?> getEmployeeToApprove(@RequestParam("employeeId") String employeeId) {

        try {
            
            Optional<Employee> employee = employeeService.getEmployeeById(employeeId);
            if (employee.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body(new ApiResponse("No employees found for the given employeeId", 404));
            }
            List<Employee> approval = approvalService.getApprovers(employeeId);
            return ResponseEntity.ok(approval);

        } catch (Exception e) {
            return new ResponseEntity<>("Error " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        
    }

    @GetMapping("/proposers")
    public ResponseEntity<?> getProposers() {
        List<Employee> employees = placementService.findEmployeesByGradeShortNameIn();
        if (employees.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiResponse("No employees found", 404));
        }
        return ResponseEntity.ok(employees);
    }
    
}

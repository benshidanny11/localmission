package com.rra.local_mission_management.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rra.local_mission_management.dto.responce.ApiResponse;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.Placement;
import com.rra.local_mission_management.entity.PlacementsStructureMap;
import com.rra.local_mission_management.service.EmailService;
import com.rra.local_mission_management.service.EmployeeService;
import com.rra.local_mission_management.service.PlacementService;


@RestController
@RequestMapping("/api/v1/employees")
public class UserController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private PlacementService placementService;

    @Autowired
    private EmailService emailService;


    @GetMapping("/info")
    public ResponseEntity<?> searchEmployees(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        List<Employee> employees = employeeService.searchEmployees(username);
        if (employees.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse("No employees found", 404));
        }
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/get-place")
    public ResponseEntity<?> s(@RequestParam String employeeId) {
        Placement placement = placementService.place(employeeId);
        return ResponseEntity.ok(placement);
    }

    @GetMapping("/get-place-map")
    public ResponseEntity<?> sm(@RequestParam String employeeId) {
        PlacementsStructureMap placement = placementService.placeMap(employeeId);
        return ResponseEntity.ok(placement);
    }


    @GetMapping("/sendEmail")
    public ResponseEntity<?> ssm(@RequestParam String email) {
        emailService.sendTestEmail(email);
        return ResponseEntity.ok("Sent");
    }
}

package com.rra.local_mission_management.service;

import com.rra.local_mission_management.dto.request.PlacementDTO;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.JobMaster;
import com.rra.local_mission_management.entity.Placement;
import com.rra.local_mission_management.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PlacementService placementService;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, PlacementService placementService) {
        this.employeeRepository = employeeRepository;
        this.placementService = placementService;
    }

    public Optional<Employee> getEmployeeById(String employeeId) {
        return employeeRepository.findById(employeeId);
    }

    public Optional<String> getEmployeeJobTitle(String employeeId) {
        Optional<Employee> employee = employeeRepository.findById(employeeId);
    
        if (employee.isPresent()) {
            Placement placement = placementService.findByEmployee_EmployeeId(employeeId);
            return Optional.ofNullable(placement)
                .map(Placement::getJobMaster)  // Get JobMaster from Placement
                .map(JobMaster::getJobTitle);  // Get jobTitle from JobMaster
        } else {
            return Optional.empty();
        }
    }
    
    
    

    public List<Employee> searchEmployees(String searchTerm) {
        List<Employee> employees = employeeRepository.findByEmployeeIdOrName(searchTerm);
        for(Employee employee : employees) {
            PlacementDTO placementEmployee = placementService.getStructureWithJobMasterAndGradeByEmployeeId(employee.getEmployeeId());
            employee.setPlacement(placementEmployee);
        }
        return employees;
    }

    public List<Employee> getEmployeesByJobTitle(String jobTitle) {
        return employeeRepository.findByJobTitle(jobTitle);
    }

    public List<Employee> getEmployeesByDepartmentName(String department) {
        return employeeRepository.findByDepartmentName(department);
    }

    public List<Employee> getEmployeesByDepartmentId(int departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    public Optional<Employee> findFirstByWorkEmailOrPersonalEmail(String email) {
        return employeeRepository.findFirstByWorkEmailOrPersonalEmail(email, email);
    }

    public Employee getEmployeeToApprove(Employee employee) {

        List<Employee> employees = employeeRepository.findByDepartmentId(employee.getDepartment().getDepartmentId());

        int gradeId = employee.getCurrentJob().getGradeId().getGradeId();
        Optional<Employee> filteredEmployee = employees.stream()
            .filter(empl -> {
                int currentGradeId = empl.getCurrentJob().getGradeId().getGradeId();
                if (gradeId > 3) {
                    return currentGradeId == 3;
                } else if (gradeId == 2 || gradeId == 3) {
                    return currentGradeId == 1;
                } else if (gradeId == 1) {
                    return currentGradeId == 2;
                }
                return false;
            })
            .findFirst();

        return filteredEmployee.orElse(null);
    }

    public List<Employee> getEmployeesInSameStructureByEmployeeId(String employeeId) {
        Integer structureId = employeeRepository.findStructureIdByEmployeeId(employeeId);
        if (structureId != null) {
            return employeeRepository.findEmployeesByStructureId(structureId);
        }
        return List.of(); // Return empty list if no structure is found
    }

    public List<Employee> getEmployeesInSameStructureByEmployeeIdV2(String employeeId) {
        return employeeRepository.findEmployeesInSameStructureByEmployeeId(employeeId);
    }   
    

    public List<Placement> getEmployeesInSameStructureByEmployeeIdV3(String employeeId) {
        return employeeRepository.findPlacementsInSameStructureByEmployeeId(employeeId);
    }   
    
    
}

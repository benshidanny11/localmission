package com.rra.local_mission_management.service;

import com.rra.local_mission_management.entity.Admin;
import com.rra.local_mission_management.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final EmployeeService employeeService;

    @Autowired
    public AdminService(AdminRepository adminRepository, EmployeeService employeeService) {
        this.adminRepository = adminRepository;
        this.employeeService = employeeService;
    }

    public Optional<Admin> findByUsername(String username) {
        Optional<Admin> adminOptional = adminRepository.findTopByUsername(username);

        if (adminOptional.isPresent()) {
            Admin admin = adminOptional.get();
            Optional<String> roleOptional = employeeService.getEmployeeJobTitle(admin.getUsername());
            roleOptional.ifPresent(admin::setRole);
        }

        return adminOptional;
    }
}

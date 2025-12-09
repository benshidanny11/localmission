package com.rra.local_mission_management.service;

import com.rra.local_mission_management.entity.User;
import com.rra.local_mission_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmployeeService employeeService;

    @Autowired
    public UserService(UserRepository userRepository, EmployeeService employeeService) {
        this.userRepository = userRepository;
        this.employeeService = employeeService;
    }

    public Optional<User> findByUsername(String userName) {

        Optional<User> userOptional = userRepository.findByUsername(userName);

        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Optional<String> roleOptional = employeeService.getEmployeeJobTitle(user.getUsername());
            roleOptional.ifPresent(user::setRole);
        }
        return userOptional;
    }
}

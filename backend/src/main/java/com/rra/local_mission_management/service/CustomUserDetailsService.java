package com.rra.local_mission_management.service;

import com.rra.local_mission_management.enums.AccountStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.rra.local_mission_management.entity.Admin;
import com.rra.local_mission_management.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminService adminService;
    private final UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);


    public CustomUserDetailsService(AdminService adminService, UserService userService) {
        this.adminService = adminService;
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Check in the Admin table first
        Optional<Admin> adminOptional = adminService.findByUsername(username);

        if (adminOptional.isPresent()) {
            logger.info("**********************Admin from DB: {}", adminOptional.get());
                return adminOptional.get();
             // Return the Admin entity which implements UserDetails
        }

        // If not found in Admin, check the User table
        Optional<User> userOptional = userService.findByUsername(username);
        if (userOptional.isPresent()) {
            logger.info("**********************User from DB: {}", userOptional.get());
            return userOptional.get();
        }

        // If not found in either table, throw an exception
        throw new UsernameNotFoundException("User or Admin not found with username: " + username);
    }
}

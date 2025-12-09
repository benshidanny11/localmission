package com.rra.local_mission_management.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.dto.request.LoginRequest;
import com.rra.local_mission_management.dto.responce.DepartmentResponce;
import com.rra.local_mission_management.dto.responce.LoginResponse;
import com.rra.local_mission_management.entity.Admin;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.Placement;
import com.rra.local_mission_management.entity.Structure;
import com.rra.local_mission_management.entity.User;
import com.rra.local_mission_management.exception.AuthenticationException;
import com.rra.local_mission_management.jwt.JwtUtils;
import com.rra.local_mission_management.repository.AdminRepository;
import com.rra.local_mission_management.repository.PlacementsStructureMapRepository;

import java.util.Optional;

@Service
public class AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    private final AdminRepository repository;
    private final AdminService adminService;
    private final UserService userService;
    private final PlacementService placementService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmployeeService employeeService;

    @Autowired
    private PlacementsStructureMapRepository placementsStructureMapRepository;

    @Autowired
    public AuthenticationService(AdminRepository repository,
                                 PasswordEncoder passwordEncoder,
                                 JwtUtils jwtService,
                                 AuthenticationManager authenticationManager,
                                 AdminService adminService,
                                 EmployeeService employeeService,
                                 UserService userService,
                                 PlacementService placementService
                                 ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.adminService = adminService;
        this.employeeService = employeeService;
        this.userService = userService;
        this.placementService = placementService;
    }

    public LoginResponse register(LoginRequest request) {
        logger.info("Attempting to register user: {}", request.getUsername());

        // Check if user already exists
        if (repository.findTopByUsername(request.getUsername()).isPresent()) {
            logger.warn("User already exists: {}", request.getUsername());
            return new LoginResponse(null, "User already exists");
        }

        Admin user = new Admin();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmployeeId(request.getUsername());
        logger.debug("Encoded password for user: {}", user.getUsername());

        user = repository.save(user);
        Admin userInfo = adminService.findByUsername(request.getUsername())
                .orElseThrow(() -> new AuthenticationException("Incorrect username or password"));
        Optional<Employee> employee = employeeService.getEmployeeById(userInfo.getEmployeeId());
        String fullNames = employee.get().getFamilyName() + " " + employee.get().getGivenName();
        String grade = employee.get().getCurrentJob().getGradeId().getShortName();
        DepartmentResponce departmentResponce = new DepartmentResponce(employee.get().getDepartment().getDepartmentId(), employee.get().getDepartment().getDepartmentName());
        String jwt = jwtService.generateTokenFromUsername(user, fullNames, grade, departmentResponce);
        logger.info("User registered successfully: {}", request.getUsername());
        return new LoginResponse( jwt, "User registration was successful");
    }

    public LoginResponse authenticate(LoginRequest request) {

        logger.info("Attempting to authenticate user: {}", request.getUsername());

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        logger.debug("Authentication token created: {}", authentication);

        try {
            authenticationManager.authenticate(authentication);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Optional<Admin> adminOpt = adminService.findByUsername(request.getUsername());

            if(adminOpt.isPresent()) {
                Admin user = adminOpt.get();
                Optional<Employee> employee = employeeService.getEmployeeById(user.getUsername());
                Placement placement = placementService.findByEmployee_EmployeeId(request.getUsername());
                Structure placementMapStructure = placementsStructureMapRepository.findStructureByEmployee(employee.get());
                String fullNames = placement.getEmployee().getFamilyName() + " " + placement.getEmployee().getGivenName();
                String grade = placement.getJobMaster().getGradeId().getShortName();
                DepartmentResponce departmentResponce;

                if(placementMapStructure != null){
                    departmentResponce = new DepartmentResponce(placementMapStructure.getStructureId(), placementMapStructure.getStructureName());
                }else {
                    departmentResponce = new DepartmentResponce(placement.getStructure().getStructureId(), placement.getStructure().getStructureName());
                }
                String jwt = jwtService.generateTokenFromUsername(user, fullNames, grade, departmentResponce);




                logger.info("User authenticated successfully: {}", request.getUsername());
                return new LoginResponse( jwt, "User login was successful");
            }else {

                Optional<User> userOpt = userService.findByUsername(request.getUsername());
                Placement placement = placementService.findByEmployee_EmployeeId(request.getUsername());

                if(!userOpt.isPresent() || placement == null) {
                    new AuthenticationException("Incorrect username or password");
                }

                User user = userOpt.get();
                Optional<Employee> employee = employeeService.getEmployeeById(user.getUsername());
                Structure placementMapStructure = placementsStructureMapRepository.findStructureByEmployee(employee.get());
                String fullNames = placement.getEmployee().getFamilyName() + " " + placement.getEmployee().getGivenName();
                String grade = placement.getJobMaster().getGradeId().getShortName();
                DepartmentResponce departmentResponce;

                if(placementMapStructure != null){
                    departmentResponce = new DepartmentResponce(placementMapStructure.getStructureId(), placementMapStructure.getStructureName());
                }else {
                    departmentResponce = new DepartmentResponce(placement.getStructure().getStructureId(), placement.getStructure().getStructureName());
                }
                String jwt = jwtService.generateTokenFromUsername(user, fullNames, grade, departmentResponce);




                logger.info("User authenticated successfully: {}", request.getUsername());
                return new LoginResponse( jwt, "User login was successful");
            }


        } catch (Exception e) {
            logger.error("Authentication failed for user: {}", request.getUsername(), e);
            throw new AuthenticationException("Invalid Username or Password");
        }
    }
}

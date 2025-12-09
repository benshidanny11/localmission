package com.rra.local_mission_management.controller.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rra.local_mission_management.dto.request.LoginRequest;
import com.rra.local_mission_management.dto.responce.LoginFailResponse;
import com.rra.local_mission_management.dto.responce.LoginResponse;
import com.rra.local_mission_management.exception.AuthenticationException;
import com.rra.local_mission_management.service.AuthenticationService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody LoginRequest request) {
        LoginResponse response = authenticationService.register(request);
        if (response != null) {
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authenticationService.authenticate(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AuthenticationException e) {
            LoginFailResponse failResponse = new LoginFailResponse("Authentication failed", e.getMessage());
            return new ResponseEntity<>(failResponse, HttpStatus.UNAUTHORIZED);
        }
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<LoginFailResponse> handleAuthenticationException(AuthenticationException ex) {
        LoginFailResponse failResponse = new LoginFailResponse("Authentication failed", ex.getMessage());
        return new ResponseEntity<>(failResponse, HttpStatus.UNAUTHORIZED);
    }


}

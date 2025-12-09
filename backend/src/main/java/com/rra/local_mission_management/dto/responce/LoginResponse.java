package com.rra.local_mission_management.dto.responce;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@ToString
public class LoginResponse {
    private String jwtToken;

    private String message;

//    public LoginResponse(String username, String role, String jwtToken, String message, String fullNames, String grade, DepartmentResponce department) {
//        this.username = username;
//        this.role = role;
//        this.jwtToken = jwtToken;
//        this.message = message;
//        this.fullnames = fullNames;
//        this.grade = grade;
//        this.department = department;
//    }

    public LoginResponse( String jwtToken, String message) {
        this.jwtToken = jwtToken;
        this.message = message;
    }

//    public String getJwtToken() {
//        return jwtToken;
//    }
//
//    public void setJwtToken(String jwtToken) {
//        this.jwtToken = jwtToken;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getRole() {
//        return role;
//    }
//
//    public void setRole(String role) {
//        this.role = role;
//    }
//
//    public String getMessage() {
//        return message;
//    }
//
//    public void setMessage(String message) {
//        this.message = message;
//    }
//
//    public String getFullnames() {
//        return fullnames;
//    }
//
//    public void setFullnames(String fullnames) {
//        this.fullnames = fullnames;
//    }
//
//    public String getGrade() {
//        return grade;
//    }
//
//    public void setGrade(String grade) {
//        this.grade = grade;
//    }
//
//    public DepartmentResponce getDepartment() {
//        return department;
//    }
//
//    public void setdepartment(DepartmentResponce department) {
//        this.department = department;
//    }
        
}
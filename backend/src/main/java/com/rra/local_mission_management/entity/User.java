package com.rra.local_mission_management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "users")
@Data
@ToString
public class User implements UserDetails{

    @Id
    @Column(name = "Id")
    private int id;

    @Column(name = "User_Name", nullable = false, length = 100)
    private String username;

    @Column(name = "Password", nullable = false, length = 1000)
    private String password;

    @Column(name = "Account_Status", nullable = false, length = 90)
    private String accountStatus;

    @Column(name = "Created_By", nullable = false)
    private int createdBy;

    @Column(name = "Date_Time", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "password_state", nullable = false, length = 100)
    private String passwordState;

    @Column(name = "email_sent", nullable = false, length = 80)
    private String emailSent;

    @Transient
    private String role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

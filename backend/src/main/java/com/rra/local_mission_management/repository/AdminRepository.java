package com.rra.local_mission_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rra.local_mission_management.entity.Admin;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findTopByUsername(String username);
}

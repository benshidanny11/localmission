
package com.rra.local_mission_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.rra.local_mission_management.entity.BankDetails;



@Repository
public interface BankDetailsRepository  extends JpaRepository<BankDetails, Long>{
    @Query("SELECT b FROM BankDetails b WHERE b.employee.id = :employeeId")
    Optional<BankDetails> findByEmployeeId(String employeeId);


}
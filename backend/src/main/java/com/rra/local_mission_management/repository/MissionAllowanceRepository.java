package com.rra.local_mission_management.repository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;


@Repository
@Slf4j
public class MissionAllowanceRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Object calculateAllowance(String employeeId, String missionDetailsJson) {
        log.info("Calculating allowance for employee id {}, JSON DATA: {}",employeeId, missionDetailsJson);
        // Create stored procedure query
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("CalculateAllowance");
        
        // Set input parameters
        query.registerStoredProcedureParameter(1, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(2, String.class, ParameterMode.IN);

        query.setParameter(1, employeeId);
        query.setParameter(2, missionDetailsJson);
        
        // Execute the procedure and get result
        query.execute();

        // Get the result if there is one
        Object totalAmount = query.getSingleResult();
        return totalAmount;
    }
}

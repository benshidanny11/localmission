package com.rra.local_mission_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rra.local_mission_management.dto.request.PaymentBatchDTO;
import com.rra.local_mission_management.dto.request.PaymentBatchRequest;
import com.rra.local_mission_management.entity.MissionPaymentBatch;

import jakarta.transaction.Transactional;

@Repository
public interface MissionPaymentBatchRepository extends JpaRepository<MissionPaymentBatch, String> {
    @Query("SELECT new com.rra.local_mission_management.dto.request.PaymentBatchRequest(mb.paymentType, mb.iban, mb.amount, mb.description) FROM MissionPaymentBatch mb")
    List<PaymentBatchRequest> findAllBatchDetails();

    @Query("SELECT new com.rra.local_mission_management.dto.request.PaymentBatchDTO(mb.sn, mb.amount, mb.description, mb.status, mb.createdAt) FROM MissionPaymentBatch mb")
    List<PaymentBatchDTO> findBatchDetails();

    @Query(" SELECT COALESCE(MAX(CAST(SUBSTRING(mb.sn, 8, LENGTH(mb.sn)) AS int)), 0) FROM MissionPaymentBatch mb WHERE mb.sn LIKE 'MPBatch%'")
    int findLatestBatchNumber();

    @Modifying
    @Transactional
    @Query("UPDATE MissionPaymentBatch mpb SET mpb.status = :status WHERE mpb.sn = :sn")
    void updateBatchStatus(@Param("sn") String sn, @Param("status") String status);

    MissionPaymentBatch findBySn(String sn);

    @Query("SELECT mpb FROM MissionPaymentBatch mpb ORDER BY mpb.sn DESC")
    List<MissionPaymentBatch> findAllOrderBySnDesc();
}

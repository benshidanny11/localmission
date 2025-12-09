package com.rra.local_mission_management.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.MissionDetails;
import com.rra.local_mission_management.entity.MissionPaymentBatch;
import com.rra.local_mission_management.enums.ReportStatus;
import com.rra.local_mission_management.enums.Status;

@Repository
public interface MissionDetailsRepository extends JpaRepository<MissionDetails, Long> {

    // Get all MissionDetails
    @Override
    List<MissionDetails> findAll();

    // Get MissionDetails by employee ID
    List<MissionDetails> findByEmployeeOrRequesterOrderByIdDesc(Employee employee, Employee requester);

    // Get MissionDetails by mission detail ID
    Optional<MissionDetails> findById(Long id);

    // Search MissionDetails by employee ID and reference ID
    List<MissionDetails> findByEmployee_EmployeeIdAndReferenceId(String employeeId, String referenceId);
    // Get MissionDetails by referenceId
    Optional<MissionDetails> findByReferenceId(String referenceId);

    // Find the first unsubmitted mission for the given employee, with the specified report status and a status that is not the given value
    Optional<MissionDetails> findFirstByEmployee_EmployeeIdAndReportStatusAndStatusIsNot(
        String employeeId, 
        ReportStatus reportStatus, 
        Status excludedStatus
    );

    List<MissionDetails> findByApprover_EmployeeIdAndStatusInOrderByIdDesc(String approverId, List<Status> statuses);

    List<MissionDetails> findByStatusInOrderByIdDesc(List<Status> statuses);

    List<MissionDetails> findByStatusAndMissionPaymentBatchIsNullOrderByIdDesc(Status status);

    @Query("SELECT m FROM MissionDetails m WHERE m.isReportSubmissionRemained = false AND m.endDate > :currentDate")
    List<MissionDetails> findMissionsForComplianceCheck(@Param("currentDate") LocalDate currentDate);

    List<MissionDetails> findByMissionPaymentBatch(MissionPaymentBatch missionPaymentBatch);

    @Query("SELECT m FROM MissionDetails m WHERE m.employee = :employee AND "
            + "((m.startDate <= :endDate AND m.endDate >= :startDate)) AND m.status NOT IN ('MISSION_ORDER_REJECTED','MISSION_ORDER_CLEARANCE_RECORD_CANCELLED')")
    List<MissionDetails> findOverlappingMissions(@Param("employee") Employee employee,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);

    @Query("SELECT m FROM MissionDetails m WHERE m.status NOT IN (:excludedStatuses) ORDER BY m.id DESC")
    List<MissionDetails> findAllByOrderByIdDescExcludeStatuses(@Param("excludedStatuses") List<Status> excludedStatuses);

    @Query("""
    SELECT m FROM MissionDetails m
    WHERE m.employee.employeeId = :employeeId AND datediff(curdate(), m.endDate)>=8
        AND m.status ='MISSION_PAYMENT_BATCH_CREATED'
        AND m.reportStatus ='NOT_SUBMITTED'
""")
    List<MissionDetails> findPendingMissions(@Param("employeeId") String employeeId);
}


package com.rra.local_mission_management.service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rra.local_mission_management.dto.request.PlacementDTO;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.MissionDetails;
import com.rra.local_mission_management.entity.MissionPaymentBatch;
import com.rra.local_mission_management.enums.ReportStatus;
import com.rra.local_mission_management.enums.Status;
import com.rra.local_mission_management.exception.OverlappingMissionsException;
import com.rra.local_mission_management.repository.MissionDetailsRepository;

@Service
public class MissionDetailsService {

    @Autowired
    private MissionDetailsRepository missionDetailsRepository;

    @Autowired
    private PlacementService placementService;

    private void setPlacementsByEmployee(MissionDetails missionDetail) {
        if (missionDetail.getEmployee() != null) {
            PlacementDTO placementEmployee = placementService.getStructureWithJobMasterAndGradeByEmployee(missionDetail.getEmployee());
            missionDetail.getEmployee().setPlacement(placementEmployee);
        }
    }

    // Get all MissionDetails
    public List<MissionDetails> getAllMissionDetails() {
        List<MissionDetails> missionDetails = missionDetailsRepository.findAll();
        for (MissionDetails missionDetail : missionDetails) {
            setPlacementsByEmployee(missionDetail);  
        }
        return missionDetails;
    }

    // Get MissionDetails by ID
    public Optional<MissionDetails> getMissionDetailsById(Long id) {
        Optional<MissionDetails> missionDetailOpt = missionDetailsRepository.findById(id);
        missionDetailOpt.ifPresent(this::setPlacementsByEmployee);
        return missionDetailOpt;
    }

    // Get MissionDetails by Employee ID
    public List<MissionDetails> getMissionDetailsByEmployeeId(Employee employee) {
        List<MissionDetails> missionDetails = missionDetailsRepository.findByEmployeeOrRequesterOrderByIdDesc(employee, employee);
        for (MissionDetails missionDetail : missionDetails) {
            setPlacementsByEmployee(missionDetail);  
        }
        return missionDetails;
    }

    // Search MissionDetails by Employee ID and Reference ID
    public List<MissionDetails> searchMissionDetailsByEmployeeIdAndReferenceId(Employee employee, String referenceId) {
        List<MissionDetails> missionDetails = missionDetailsRepository.findByEmployee_EmployeeIdAndReferenceId(employee.getEmployeeId(), referenceId);
        for (MissionDetails missionDetail : missionDetails) {
            setPlacementsByEmployee(missionDetail);  
        }
        return missionDetails;
    }

    // Get MissionDetails by Reference ID
    public Optional<MissionDetails> getMissionDetailsByReferenceId(String referenceId) {
        Optional<MissionDetails> missionDetailOpt = missionDetailsRepository.findByReferenceId(referenceId);
        missionDetailOpt.ifPresent(this::setPlacementsByEmployee);
        return missionDetailOpt;
    }

    // Save MissionDetails
    public MissionDetails saveMissionDetails(MissionDetails missionDetails) {
        MissionDetails savedMissionDetails = missionDetailsRepository.save(missionDetails);
        setPlacementsByEmployee(savedMissionDetails);
        return savedMissionDetails;
    }

    // Retrieve the first mission with status NOT_SUBMITTED for the given employeeId
    public Optional<MissionDetails> getUnsubmittedMissionForUser(Employee employee) {
        Optional<MissionDetails> missionDetailOpt = missionDetailsRepository.findFirstByEmployee_EmployeeIdAndReportStatusAndStatusIsNot(
                employee.getEmployeeId(), ReportStatus.NOT_SUBMITTED, Status.MISSION_ORDER_REJECTED);
        missionDetailOpt.ifPresent(this::setPlacementsByEmployee);
        return missionDetailOpt;
    }

    // Get missions by Approver ID and Statuses
    public List<MissionDetails> getMissionsByApproverIdAndStatuses(Employee approver) {
        List<Status> statuses = Arrays.asList(Status.SUBMITTED_FOR_APPROVAL, Status.APPROVED, Status.REPORTED, Status.CLAIM_SUBMITTED, Status.MISSION_COMPUTED, Status.MISSION_PAYMENT_BATCH_CREATED, Status.MISSION_ORDER_CLEARANCE_RECORD_CANCELLED, Status.MISSION_REPORT_ACCEPTED);
        List<MissionDetails> missionDetails = missionDetailsRepository.findByApprover_EmployeeIdAndStatusInOrderByIdDesc(approver.getEmployeeId(), statuses);
        for (MissionDetails missionDetail : missionDetails) {
            setPlacementsByEmployee(missionDetail);
        }
        return missionDetails;
    }

    // Get missions by Status and exclude the provided Employee
    public List<MissionDetails> findByStatusOrderByIdDesc() {
        List<Status> statuses = Arrays.asList(Status.APPROVED, Status.CLAIM_SUBMITTED, Status.MISSION_COMPUTED, Status.MISSION_PAYMENT_BATCH_CREATED, Status.REPORTED, Status.MISSION_REPORT_ACCEPTED);
        List<MissionDetails> missionDetails = missionDetailsRepository.findByStatusInOrderByIdDesc(statuses);
        for (MissionDetails missionDetail : missionDetails) {
            setPlacementsByEmployee(missionDetail);
        }
        return missionDetails;
    }

    // Find computed missions without a payment batch
    public List<MissionDetails> findComputedMissionsWithoutPaymentBatch() {
        List<MissionDetails> missionDetails = missionDetailsRepository.findByStatusAndMissionPaymentBatchIsNullOrderByIdDesc(Status.MISSION_COMPUTED);
        for (MissionDetails missionDetail : missionDetails) {
            setPlacementsByEmployee(missionDetail);  
        }
        return missionDetails;
    }

    // Get missions for compliance check
    public List<MissionDetails> getMissionsForComplianceCheck() {
        LocalDate today = LocalDate.now();
        LocalDate currentDatePlusTwoDays = today.plusDays(2);
        List<MissionDetails> missionDetails = missionDetailsRepository.findMissionsForComplianceCheck(currentDatePlusTwoDays);
        for (MissionDetails missionDetail : missionDetails) {
            setPlacementsByEmployee(missionDetail);  
        }
        return missionDetails;
    }

    // Get missions by Payment Batch
    public List<MissionDetails> getMissionsByPaymentBatch(MissionPaymentBatch batch) {
        List<MissionDetails> missionDetails = missionDetailsRepository.findByMissionPaymentBatch(batch);
        for (MissionDetails missionDetail : missionDetails) {
            setPlacementsByEmployee(missionDetail);  
        }
        return missionDetails;
    }

    public void validateMissionOverlap(MissionDetails newMission) {
        LocalDate startDate = newMission.getStartDate();
        LocalDate endDate = newMission.getEndDate();
        Employee employee = newMission.getEmployee();

        // Check if there are any overlapping missions for the employee
        List<MissionDetails> overlappingMissions = missionDetailsRepository
            .findOverlappingMissions(employee, startDate, endDate);

        if (!overlappingMissions.isEmpty()) {
            // throw new OverlappingMissionsException("Employee has another mission in selected period");
            String overlappingMissionIds = overlappingMissions.stream()
            .map(MissionDetails::getReferenceId)
            .collect(Collectors.joining(", "));

            // Throw an exception with the overlapping reference IDs in the message
            throw new OverlappingMissionsException(
                String.format("Employee has another mission in the selected period (%s)", overlappingMissionIds)
            );
        }
    }

    public List<MissionDetails> getMissionDetailsExcludeRejectedAndReturned() {
        List<Status> excludedStatuses = Arrays.asList(Status.MISSION_ORDER_REJECTED, Status.MISSION_ORDER_RETURNED);
        List<MissionDetails> missionDetails = missionDetailsRepository.findAllByOrderByIdDescExcludeStatuses(excludedStatuses);
        for (MissionDetails missionDetail : missionDetails) {
            setPlacementsByEmployee(missionDetail);
        }
        return missionDetails;
    }

    public List<MissionDetails> getPendingMissionsForEmployee(Employee employee) {
    //    LocalDate deadline = LocalDate.now().minusDays(8);
        return missionDetailsRepository.findPendingMissions(employee.getEmployeeId());
    }
}

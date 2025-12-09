package com.rra.local_mission_management.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.rra.local_mission_management.enums.ReportStatus;
import com.rra.local_mission_management.enums.Status;
import com.rra.local_mission_management.enums.TransportMode;
import com.rra.local_mission_management.serializer.EmployeeSerializer;
import com.rra.local_mission_management.serializer.EmployeeSerializerRequester;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name = "mission_details")
public class MissionDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_id", nullable = false, unique = true)
    private String referenceId;

    @JsonSerialize(using = EmployeeSerializerRequester.class)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id", nullable = false)
    private Employee employee;

    @Lob
    @Column(name = "purpose_of_mission", nullable = false, columnDefinition = "TEXT")
    private String purposeOfMission;

    @Lob
    @Column(name = "expected_results", nullable = false, columnDefinition = "TEXT")
    private String expectedResults;

    @JsonSerialize(using = EmployeeSerializer.class)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposer_id", referencedColumnName = "employee_id", nullable = false)
    private Employee proposer;

    @JsonSerialize(using = EmployeeSerializer.class)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id", nullable = false)
    private Employee approver;

    @Column(nullable = false)
    private String place;

    @Temporal(TemporalType.DATE)
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "mission_days", nullable = false)
    private int missionDays;

    @Column(name = "mission_nights", nullable = false)
    private int missionNights;

    @Column(nullable = true)
    private Double mileage;

    @Enumerated(EnumType.STRING)
    @Column(name = "transport_mode", nullable = false)
    private TransportMode transportMode;

    @Column(name = "mission_allowance", nullable = false)
    private Double missionAllowance;

    @Column(name = "transport_mileage_allowance", nullable = true)
    private Double transportMileageAllowance;

    @Column(name = "total_amount", nullable = true)
    private Double totalAmount;

    @Column(nullable = true)
    private Double distance;

    @Column(nullable = true)
    private String plate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @OneToMany(mappedBy = "missionDetails", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MissionFile> missionFiles = new ArrayList<>();

    @OneToMany(mappedBy = "missionDetails", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MissionHistoryRecord> missionHistoryRecords = new ArrayList<>();

    // @JsonIgnore
    @OneToMany(mappedBy = "missionDetails", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<MissionDestination> missionDestinations = new ArrayList<>();

    public void addHistory(MissionHistoryRecord historyRecord) {
        missionHistoryRecords.add(historyRecord);
        historyRecord.setMissionDetails(this);
    }

    public void addMissionDestination(MissionDestination destination) {
        missionDestinations.add(destination);
        destination.setMissionDetails(this);
    }

    public void addMissionFile(MissionFile missionFile) {
        missionFiles.add(missionFile);
        missionFile.setMissionDetails(this);
    }

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name="is_report_submitted", nullable = true)
    private ReportStatus reportStatus;

    @Lob
    @Column(name = "weekend_reason", nullable = true, columnDefinition = "TEXT")
    private String weekendReason;

    @Lob
    @Column(name = "report_summary", nullable = true, columnDefinition = "TEXT")
    private String reportSummary;

    @Lob
    @Column(name = "claim_summary", nullable = true, columnDefinition = "TEXT")
    private String claimSummary;

    @Column(name = "claim_amount", nullable = true)
    private Double claimAmount;

    @Column(name = "is_report_submission_remained", nullable = false)
    private Boolean isReportSubmissionRemained;

    @JsonSerialize(using = EmployeeSerializerRequester.class)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", referencedColumnName = "employee_id", nullable = true)
    private Employee requester;





    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_payment_batch_id", nullable= true)
    private MissionPaymentBatch missionPaymentBatch;

    public MissionDetails(){
        this.reportStatus = ReportStatus.NOT_SUBMITTED;
        this.status = Status.SUBMITTED_FOR_APPROVAL;
        this.weekendReason = null;
        this.reportSummary = null;
        this.claimSummary = null;
        this.isReportSubmissionRemained = false;
    }
}

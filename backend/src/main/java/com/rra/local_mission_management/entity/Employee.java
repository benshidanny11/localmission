package com.rra.local_mission_management.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rra.local_mission_management.dto.request.PlacementDTO;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table(name = "employees")
@Data
@DynamicUpdate
public class Employee {
    @Id
    @Column(name = "employee_id", nullable = true)
    private String employeeId;

    @Column(name = "given_name", nullable = true)
    private String givenName;

    @Column(name = "family_name", nullable = true)
    private String familyName;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "department", referencedColumnName = "department_id", nullable = true)
    private Department department;

    @Column(name = "gender", nullable = true)
    private String gender;

    @Column(name = "dob", nullable = true)
    private LocalDate dob;

    @Column(name = "national_id", nullable = true)
    private String nationalId;

    @Column(name = "phone_number", nullable = true)
    private String phoneNumber;

    @Column(name = "work_email", nullable = true)
    private String workEmail;

    @Column(name = "personal_email", nullable = true)
    private String personalEmail;

    @Column(name = "join_date", nullable = true)
    private LocalDate joinDate;

    @Column(name = "profile_flag", nullable = true)
    private boolean profileFlag;

    @Column(name = "curr_job_flag", nullable = true)
    private boolean currJobFlag;

    @JsonIgnore
    @Column(name = "curr_job_id", insertable = false, updatable = false, nullable = true)
    private int currJobId;

    @Column(name = "rra_job_count", nullable = true)
    private int rraJobCount;

    @Column(name = "ext_job_count", nullable = true)
    private int extJobCount;

    @Column(name = "is_punished", nullable = true)
    private boolean isPunished;

    @Column(name = "confirm_status", nullable = true)
    private boolean confirmStatus;

    @Column(name = "letter_confirm", nullable = true)
    private int letterConfirm;

    @Column(name = "letter_conf_date", nullable = true)
    private LocalDateTime letterConfDate;

    @Column(name = "job_descriptions_confirm", nullable = true)
    private int jobDescriptionsConfirm;

    @Column(name = "jds_conf_date", nullable = true)
    private LocalDateTime jdsConfDate;

    @Column(name = "pmapp_confirm", nullable = true)
    private int pmappConfirm;

    @Column(name = "pmapp_conf_date", nullable = true)
    private LocalDateTime pmappConfDate;

    @Column(name = "appeal_letter_confirm", nullable = true)
    private int appealLetterConfirm;

    @Column(name = "app_letter_conf_date", nullable = true)
    private LocalDateTime appLetterConfDate;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "curr_job_id", referencedColumnName = "job_master_id", nullable = true)
    private JobMaster currentJob;

    @OneToOne( mappedBy="employee" , cascade = CascadeType.ALL, orphanRemoval= false)
    private BankDetails bankDetails;

    @Transient
    private PlacementDTO placement;
}

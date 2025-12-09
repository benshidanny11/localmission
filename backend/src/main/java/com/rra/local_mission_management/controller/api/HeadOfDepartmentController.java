package com.rra.local_mission_management.controller.api;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rra.local_mission_management.dto.request.ComputeMissionRequest;
import com.rra.local_mission_management.dto.request.CrossOverRequest;
import com.rra.local_mission_management.dto.request.MissionAllowanceDistrictDTO;
import com.rra.local_mission_management.dto.request.MissionDestinationHodDTO;
import com.rra.local_mission_management.dto.request.MissionDetailsHodUpdateDto;
import com.rra.local_mission_management.dto.request.MissionRequestReasonDto;
import com.rra.local_mission_management.dto.request.PlacementDTO;
import com.rra.local_mission_management.dto.responce.ApiResponse;
import com.rra.local_mission_management.dto.responce.CrossOverResponse;
import com.rra.local_mission_management.dto.responce.ResponseDto;
import com.rra.local_mission_management.entity.District;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.Grade;
import com.rra.local_mission_management.entity.MissionAllowance;
import com.rra.local_mission_management.entity.MissionDestination;
import com.rra.local_mission_management.entity.MissionDetails;
import com.rra.local_mission_management.entity.MissionFile;
import com.rra.local_mission_management.entity.MissionHistoryRecord;
import com.rra.local_mission_management.entity.MissionLocation;
import com.rra.local_mission_management.entity.Notification;
import com.rra.local_mission_management.enums.DocType;
import com.rra.local_mission_management.enums.ReportStatus;
import com.rra.local_mission_management.enums.Status;
import com.rra.local_mission_management.enums.TransportMode;
import com.rra.local_mission_management.service.DistrictService;
import com.rra.local_mission_management.service.EmailService;
import com.rra.local_mission_management.service.EmployeeService;
import com.rra.local_mission_management.service.GradeService;
import com.rra.local_mission_management.service.MissionAllowanceServiceRepo;
import com.rra.local_mission_management.service.MissionAllowanceServices;
import com.rra.local_mission_management.service.MissionDetailsService;
import com.rra.local_mission_management.service.MissionLocationService;
import com.rra.local_mission_management.service.NotificationService;
import com.rra.local_mission_management.service.PlacementService;
import com.rra.local_mission_management.utils.MissionUtils;

@RestController
@RequestMapping("/api/v1/hod")
public class HeadOfDepartmentController {

    @Value("${file.upload-dir}")
    private String uploadDir;
    @Autowired
    private MissionDetailsService missionDetailsService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private MissionAllowanceServices missionAllowanceService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private DistrictService districtService;

    @Autowired
    private MissionLocationService missionLocationService;

    @Autowired
    private MissionAllowanceServiceRepo missionAllowanceServiceRepo;

    @Autowired
    private PlacementService placementService;

    @Autowired
    private GradeService gradeService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @GetMapping("/get-missions-for-approval")
    public ResponseEntity<ResponseDto<List<MissionDetails>>> getMissionsForApproval(Authentication authentication) {
        ResponseDto<List<MissionDetails>> responseDto = new ResponseDto<>();

        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            Employee employee = employeeService.getEmployeeById(username).get();

            List<MissionDetails> missionDetails;

            missionDetails = missionDetailsService.getMissionsByApproverIdAndStatuses(employee);

            responseDto.setMessage("Missions retrieved successfully");
            responseDto.setData(missionDetails);

            return ResponseEntity.ok(responseDto);
        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid approver ID format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while retrieving missions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @GetMapping("/get-missions-for-computation")
    public ResponseEntity<ResponseDto<List<MissionDetails>>> getMissionsComputation(Authentication authentication) {
        ResponseDto<List<MissionDetails>> responseDto = new ResponseDto<>();

        try {
            List<MissionDetails> missionDetails;

            missionDetails = missionDetailsService.findByStatusOrderByIdDesc();

            responseDto.setMessage("Missions retrieved successfully");
            responseDto.setData(missionDetails);

            return ResponseEntity.ok(responseDto);
        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid approver ID format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while retrieving missions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @GetMapping("/get-missions-reports")
    public ResponseEntity<ResponseDto<List<MissionDetails>>> getMissionsReport(Authentication authentication) {
        ResponseDto<List<MissionDetails>> responseDto = new ResponseDto<>();

        try {

            List<MissionDetails> missionDetails;

            missionDetails = missionDetailsService.getMissionDetailsExcludeRejectedAndReturned();

            responseDto.setMessage("Missions retrieved successfully");
            responseDto.setData(missionDetails);

            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while retrieving missions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @PatchMapping("/submit-for-approval")
    @SendTo("/topic/notifications")
    public ResponseEntity<?> submitForApproval(@RequestParam(name = "missionDetail", required = false) String missionDetail, @RequestParam(required = false, name = "missionFiles") List<MultipartFile> missionFiles) {
        ResponseDto<MissionDetails> responseDto = new ResponseDto<>();
        Map<String, String> errors = new HashMap<>();

        try {

            if(missionDetail == null) {
                errors.put("message", "Mission details are required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            ObjectMapper objectMapper = new ObjectMapper();
            MissionDetailsHodUpdateDto missionDetailsDto = objectMapper.readValue(missionDetail, MissionDetailsHodUpdateDto.class);
            
            if(missionDetailsDto == null) {
                errors.put("message", "Mission details are required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            
            if (missionDetailsDto.getReferenceId() == null || missionDetailsDto.getReferenceId().isEmpty()) {
                errors.put("message", "Reference ID is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }
            
            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(missionDetailsDto.getReferenceId());
            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }

            MissionDetails missionDetails = mssDetails.get();
            
            if (missionDetails.getStatus().equals(Status.APPROVED)) {
                errors.put("message", "Mission details was already approved");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (!mssDetails.get().getStatus().equals(Status.SUBMITTED_FOR_APPROVAL)) {
                errors.put("message", "The mission cannot be approved because it is not in the 'SUBMITTED_FOR_APPROVAL' status.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }
            
            Optional<District> missionPlace = missionLocationService.getDistrictByName(missionDetails.getPlace());
            if(!missionPlace.isPresent()) {
                ApiResponse errorResponse = new ApiResponse("District "+missionDetails.getPlace()+" is not found", HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(errorResponse);
            }

            errors.putAll(validateMissionDetails(missionDetailsDto));

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            errors.putAll(validateMissionDestinations(missionDetailsDto.getMissionDestinations(), missionPlace.get().getDistrictCode()));

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            LocalDate mainStartDate = LocalDate.parse(missionDetailsDto.getStartDate(), DATE_FORMATTER);
            LocalDate mainEndDate = LocalDate.parse(missionDetailsDto.getEndDate(), DATE_FORMATTER);

            if (!missionDetailsDto.getMissionDestinations().isEmpty()) {
                MissionDestinationHodDTO firstDestination = missionDetailsDto.getMissionDestinations().get(0);
                MissionDestinationHodDTO lastDestination = missionDetailsDto.getMissionDestinations().get(missionDetailsDto.getMissionDestinations().size() - 1);

                LocalDate firstDestinationStartDate = LocalDate.parse(firstDestination.getStartDate(), DATE_FORMATTER);
                LocalDate lastDestinationEndDate = LocalDate.parse(lastDestination.getEndDate(), DATE_FORMATTER);

                if (!mainStartDate.isEqual(firstDestinationStartDate)) {
                    errors.put("message", "The startDate of the mission must match the startDate of the first destination.");
                }

                if (!mainEndDate.isEqual(lastDestinationEndDate)) {
                    errors.put("message", "The endDate of the mission must match the endDate of the last destination.");
                }
            }

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            boolean isCrossedOverWeekend = MissionUtils.crossesWeekend(mainStartDate, mainEndDate);

            if ( isCrossedOverWeekend &&
                    (missionDetailsDto.getWeekendReason() == null || missionDetailsDto.getWeekendReason().isEmpty())) {
                errors.put("message", "Reason for crossing over the weekend should be provided.");
            }

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (isCrossedOverWeekend) {
                if (countWords(missionDetailsDto.getWeekendReason()) > 50) {
                    errors.put("message", "Reason should contain 50 words.");
                }
            }

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            // Commented due to Louise request

//            if(isCrossedOverWeekend && (missionFiles == null || missionFiles.isEmpty())) {
//                errors.put("message", "The Memo file is required");
//                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
//            }

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if(isCrossedOverWeekend) {
                if(missionFiles!=null) {
                    for (MultipartFile missionFile : missionFiles) {
                        String contentType = missionFile.getContentType();
                        String originalFilename = missionFile.getOriginalFilename();

                        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
                            ApiResponse errorResponse = new ApiResponse("All files must be in PDF format.", HttpStatus.BAD_REQUEST.value());
                            return ResponseEntity.badRequest().body(errorResponse);
                        }

                        if (contentType == null || !contentType.equals(MediaType.APPLICATION_PDF_VALUE)) {
                            ApiResponse errorResponse = new ApiResponse("All files must be in PDF format.", HttpStatus.BAD_REQUEST.value());
                            return ResponseEntity.badRequest().body(errorResponse);
                        }
                    }
                }
            }

            List<MissionAllowanceDistrictDTO> missionAllowances = missionDetailsDto.getMissionDestinations().stream()
                    .map(destinationDTO -> {
                        MissionAllowanceDistrictDTO dto = new MissionAllowanceDistrictDTO();
                        dto.setDistrictId(Integer.parseInt(destinationDTO.getDistrictId()));
                        dto.setNumberOfDays(destinationDTO.getNumberOfDays());
                        dto.setNumberOfNights(destinationDTO.getNumberOfNights());
                        return dto;
                    })
                    .collect(Collectors.toList());


            String missionAllowanceJson = convertToJson(missionAllowances);
            Object result = missionAllowanceService.calculateAllowance(missionDetails.getEmployee().getEmployeeId().toString(), missionAllowanceJson);

            // Update mission details
            missionDetails.setPurposeOfMission(missionDetailsDto.getPurposeOfMission());
            missionDetails.setExpectedResults(missionDetailsDto.getExpectedResults());
            missionDetails.setStartDate(mainStartDate);
            missionDetails.setEndDate(mainEndDate);
            missionDetails.setMissionDays(missionDetailsDto.getMissionDays());
            missionDetails.setMissionNights(missionDetailsDto.getMissionNights());
            missionDetails.setMissionAllowance(Double.parseDouble(result.toString()));
            missionDetails.setTotalAmount(Double.parseDouble(result.toString()));
                
        
            Optional<Employee> employee = employeeService.getEmployeeById(missionDetails.getEmployee().getEmployeeId().toString());
            Optional<Employee> approver = employeeService.getEmployeeById(missionDetails.getApprover().getEmployeeId().toString());
        
            PlacementDTO placementDTO = placementService.getStructureWithJobMasterAndGradeByEmployeeId(employee.get().getEmployeeId());

            int gradeId = placementDTO.getJobMaster().getGrade().getGradeId();
            Grade grade = gradeService.getGradeById(gradeId).get();

            Optional<MissionAllowance> missionAllowance = missionAllowanceServiceRepo.getAllowanceByGrade(grade);
            if (missionDetailsDto.getMissionDestinations() != null) {
                
                missionDetails.getMissionDestinations().clear();
                for (MissionDestinationHodDTO destinationDTO : missionDetailsDto.getMissionDestinations()) {
                    MissionDestination missionDestination = new MissionDestination();
                    if(destinationDTO.getId() != null && !destinationDTO.getId().toString().isEmpty()) {
                        missionDestination.setId(destinationDTO.getId());
                    }
                    Optional<MissionLocation> missionLocation = missionLocationService.getMissionLocationsByDistrictId(Integer.parseInt(destinationDTO.getDistrictId()));
                    if(!missionLocation.isPresent()) {
                        ApiResponse errorResponse = new ApiResponse("District with "+Integer.parseInt(destinationDTO.getDistrictId())+" is not found", HttpStatus.BAD_REQUEST.value());
                        return ResponseEntity.badRequest().body(errorResponse);
                    }
                    String nightRate = getZoneByNumber(missionAllowance.get(), missionLocation.get().getZone());
                    Optional<District> district = districtService.getDistrictByCode(Integer.parseInt(destinationDTO.getDistrictId()));
                    missionDestination.setDistrict(district.get());
                    missionDestination.setStartDate(LocalDate.parse(destinationDTO.getStartDate(), DATE_FORMATTER));
                    missionDestination.setEndDate(LocalDate.parse(destinationDTO.getEndDate(), DATE_FORMATTER));
                    missionDestination.setNumberOfDays(destinationDTO.getNumberOfDays());
                    missionDestination.setNumberOfNights(destinationDTO.getNumberOfNights());
                    missionDestination.setDayRate(missionAllowance.get().getDailyAllowance());
                    missionDestination.setNightRate(nightRate);
                    missionDetails.addMissionDestination(missionDestination);
                }
            }

            if(isCrossedOverWeekend) {
                if(missionFiles !=null) {
                    for (MultipartFile missionFile : missionFiles) {

                        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
                        String newFileName = String.format("%s-%s-%s.pdf", missionDetails.getEmployee().getEmployeeId(), UUID.randomUUID().toString(), currentDate);
                        MissionFile missionFileOb = new MissionFile();
                        missionFileOb.setMissionFile(newFileName);
                        missionFileOb.setMissionDocType(DocType.MEMO);
                        missionDetails.addMissionFile(missionFileOb);

                        Path path = Paths.get(uploadDir);
                        if (!Files.exists(path)) {
                            Files.createDirectories(path);
                            System.out.println("Created directories at: " + path.toString());
                        }

                        Path filePath = path.resolve(newFileName);
                        System.out.println("Saving file to: " + filePath.toString());
                        Files.copy(missionFile.getInputStream(), filePath);
                    }
                }
            }

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();

            historyRecord.setStatus(Status.APPROVED);
            historyRecord.setPerformedBy(approver.get());
            historyRecord.setComment((missionDetailsDto.getWeekendReason() == null || missionDetailsDto.getWeekendReason().isEmpty()) ? "Mission Approved" : missionDetailsDto.getWeekendReason());

            missionDetails.addHistory(historyRecord);

            missionDetails.setWeekendReason(missionDetailsDto.getWeekendReason());
            missionDetails.setStatus(Status.APPROVED);

            MissionDetails savedMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);

            emailService.sendApprovalEmail(missionDetails, employee.orElse(null), approver.orElse(null));
            emailService.sendFinanceEmail(missionDetails, employee.orElse(null));

            if(missionDetails.getTransportMode().equals(TransportMode.TRANSPORT_SPONSOR)) {
                emailService.sendAdministrationEmail(savedMissionDetails, savedMissionDetails.getMissionDestinations());
            }

            String approversName = approver.get().getGivenName() + " " +approver.get().getFamilyName();
            Notification notification = new Notification();
            notification.setEmployee(employee.orElse(null));
            notification.setTitle("Your mission request has been approved!");
            notification.setMessage("Your mission order with reference "+savedMissionDetails.getReferenceId()+" has been approved by "+approversName+". The same email has been sent to finance for payment");
            notification.setType(Status.APPROVED);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());

            notificationService.saveNotification(notification);

            if(savedMissionDetails.getRequester() != null) {
                Notification notificationRequestor = new Notification();
                notificationRequestor.setEmployee(missionDetails.getRequester());
                notificationRequestor.setTitle("Your mission request has been approved!");
                notificationRequestor.setMessage("Your mission order with reference "+savedMissionDetails.getReferenceId()+" has been approved by "+approversName+". The same email has been sent to finance for payment");
                notificationRequestor.setType(Status.APPROVED);
                notificationRequestor.setIsRead(false);
                notificationRequestor.setDate(LocalDateTime.now());
                notificationService.saveNotification(notificationRequestor);
            }

            responseDto.setMessage("Mission details updated successfully.");
            responseDto.setData(savedMissionDetails);
            return ResponseEntity.ok(responseDto);


        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid data format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while updating mission details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    private String convertToJson(List<MissionAllowanceDistrictDTO> missionAllowance) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(missionAllowance);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert mission details to JSON", e);
        }
    }

    private String getZoneByNumber(MissionAllowance missionAllowance, int zoneNumber) {
        switch (zoneNumber) {
            case 1:
                return missionAllowance.getZone1();
            case 2:
                return missionAllowance.getZone2();
            case 3:
                return missionAllowance.getZone3();
            case 4:
                return missionAllowance.getZone4();
            default:
                throw new IllegalArgumentException("Invalid zone number: " + zoneNumber);
        }
    }

    private Map<String, String> validateMissionDetails(MissionDetailsHodUpdateDto missionDetailsDTO) {
        Map<String, String> errors = new HashMap<>();
    
        // Parse and validate the startDate and endDate
        LocalDate startDate = parseDate(missionDetailsDTO.getStartDate(), errors, "startDate");
        LocalDate endDate = parseDate(missionDetailsDTO.getEndDate(), errors, "endDate");
    
        // Check if dates are valid and in the future
        if (startDate != null && endDate != null) {
    
            if (startDate.isAfter(endDate)) {
                errors.put("message", "startDate must be before endDate");
                return errors;  // Exit immediately after finding an error
            }
    
            // Validate missionDays and missionNights
            long missionDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
            // long missionNights = missionDays - 1;
            long missionNights = missionDetailsDTO.getMissionNights();
    
            if (missionDetailsDTO.getMissionDays() != missionDays) {
                errors.put("message", "Invalid missionDays. Expected: " + missionDays);
                return errors;  // Exit immediately after finding an error
            }
    
            if (missionDetailsDTO.getMissionNights() != missionNights) {
                errors.put("message", "Invalid missionNights. Expected: " + missionNights);
                return errors;  // Exit immediately after finding an error
            }
        }
    
        // Validate Purpose of Mission
        if (missionDetailsDTO.getPurposeOfMission() == null) {
            errors.put("message", "Purpose of mission is required");
            return errors;  // Exit immediately after finding an error
        }
    
        // Validate Expected Results
        if (missionDetailsDTO.getExpectedResults() == null) {
            errors.put("message", "Expected results are required");
            return errors;  // Exit immediately after finding an error
        }
    
        // Return the errors map (empty if no errors found)
        return errors;
    }
    
    
    

    private int countWords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }
        return text.trim().split("\\s+").length;
    }

    private Map<String, String> validateMissionDestinations(List<MissionDestinationHodDTO> missionDestinations, int districtId) {
        Map<String, String> errors = new HashMap<>();

        if (missionDestinations == null || missionDestinations.isEmpty()) {
            errors.put("message", "At least one mission destination must be provided");
            return errors;
        }

        LocalDate today = LocalDate.now();
        LocalDate previousEndDate = null;

        for (int i = 0; i < missionDestinations.size(); i++) {
            MissionDestinationHodDTO destination = missionDestinations.get(i);

            LocalDate startDate = parseDate(destination.getStartDate(), errors, "missionDestinations[" + i + "].startDate");
            LocalDate endDate = parseDate(destination.getEndDate(), errors, "missionDestinations[" + i + "].endDate");

            if (startDate != null && endDate != null) {

                if (destination.getDistrictId() == null || missionDestinations.isEmpty()) {
                    errors.put("message", "District ID cannot be null or empty");
                    return errors;
                }

                long calculatedDaysRow1 = ChronoUnit.DAYS.between(startDate, endDate) + 1;
                long calculatedNightsRow1 = districtId != Integer.parseInt(destination.getDistrictId()) ? calculatedDaysRow1 - 1 : 0;

                long calculatedDaysRestRows = ChronoUnit.DAYS.between(startDate, endDate);
                long calculatedNightsRestRows = districtId != Integer.parseInt(destination.getDistrictId()) ? calculatedDaysRestRows : 0;

                if (i == 0) { // First row
                    if (destination.getNumberOfDays() != calculatedDaysRow1) {
                        errors.put("message", "Invalid numberOfDays for row number "+(i+1)+". Expected: " + calculatedDaysRow1);
                        return errors;
                    }
                    if (destination.getNumberOfNights() != calculatedNightsRow1) {
                        errors.put("message", "Invalid numberOfNights for row number "+(i+1)+". Expected: " + calculatedNightsRow1);
                        return errors;
                    }
                } else {
                    if (destination.getNumberOfDays() != calculatedDaysRestRows) {
                        errors.put("message", "Invalid numberOfDays for row number "+(i+1)+". Expected: " + calculatedDaysRestRows);
                        return errors;
                    }
                    if (destination.getNumberOfNights() != calculatedNightsRestRows) {
                        errors.put("message", "Invalid numberOfNights for row number "+(i+1)+". Expected: " + calculatedNightsRestRows);
                        return errors;
                    }

                    // Check that the endDate of the previous row matches the startDate of the current row
                    if (previousEndDate != null && !previousEndDate.isEqual(startDate)) {
                        errors.put("message", "The endDate of the previous row must match the startDate of the current row");
                        return errors;
                    }
                }

                previousEndDate = endDate;
            }
        }

        return errors;
    }

    private LocalDate parseDate(String dateStr, Map<String, String> errors, String fieldName) {
        try {
            return LocalDate.parse(dateStr, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            errors.put("message", "Invalid date format. Use dd/MM/yyyy");
            return null;
        }
    }


    @PatchMapping("/reject-mission")
    @SendTo("/topic/notifications")
    public ResponseEntity<?> rejectMission(@RequestParam String referenceId, @RequestBody(required = false) MissionRequestReasonDto missionRequestReasonDto, Authentication authentication) {
        ResponseDto<MissionDetails> responseDto = new ResponseDto<>();
        Map<String, String> errors = new HashMap<>();

        // Check if authentication is null
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse("Unauthorized access", 401));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Optional<Employee> employees = employeeService.getEmployeeById(username);

        if (!employees.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse("No employee found", 404));
        }

        try {
            // Validate the reference ID
            if (referenceId == null || referenceId.isEmpty()) {
                errors.put("message", "Reference ID is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (missionRequestReasonDto == null || missionRequestReasonDto.getReason() == null || missionRequestReasonDto.getReason().isEmpty()) {
                errors.put("message", "Reason cannot be empty.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if(countWords(missionRequestReasonDto.getReason()) > 50) {
                errors.put("message", "Reason cannot exceed 50 words.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            // Fetch mission details by reference ID
            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);
            

            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }

            if (mssDetails.get().getStatus().equals(Status.MISSION_ORDER_REJECTED)) {
                errors.put("message", "Mission details was already rejected");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (!mssDetails.get().getStatus().equals(Status.SUBMITTED_FOR_APPROVAL)) {
                errors.put("message", "The mission cannot be rejected because it is not in the 'Submitted for Approval' status.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            MissionDetails missionDetails = mssDetails.get();

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();

            historyRecord.setStatus(Status.MISSION_ORDER_REJECTED);
            historyRecord.setPerformedBy(employees.get());
            historyRecord.setComment(missionRequestReasonDto.getReason());

            missionDetails.setStatus(Status.MISSION_ORDER_REJECTED);
            missionDetails.addHistory(historyRecord);

            MissionDetails saveMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);

            responseDto.setMessage("Mission rejected successfully.");
            responseDto.setData(saveMissionDetails);

            Optional<Employee> employee = employeeService.getEmployeeById(missionDetails.getEmployee().getEmployeeId().toString());
            Optional<Employee> approver = employeeService.getEmployeeById(missionDetails.getApprover().getEmployeeId().toString());
            emailService.sendRejectionEmail(employee.orElse(null), missionDetails);

            String approversName = approver.get().getGivenName() + " " +approver.get().getFamilyName();
            Notification notification = new Notification();
            notification.setEmployee(employee.orElse(null));
            notification.setTitle("Your mission order has been rejected!");
            notification.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" has been rejected by "+approversName+".");
            notification.setType(Status.MISSION_ORDER_REJECTED);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());

            notificationService.saveNotification(notification);

            if(saveMissionDetails.getRequester() != null) {
                Notification notificationRequestor = new Notification();
                notificationRequestor.setEmployee(missionDetails.getRequester());
                notificationRequestor.setTitle("Your mission order has been rejected!");
                notificationRequestor.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" has been rejected by "+approversName+".");
                notificationRequestor.setType(Status.MISSION_ORDER_REJECTED);
                notificationRequestor.setIsRead(false);
                notificationRequestor.setDate(LocalDateTime.now());
                notificationService.saveNotification(notificationRequestor);
            }

            return ResponseEntity.ok(responseDto);

        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid data format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while updating mission details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @PatchMapping("/return-mission")
    @SendTo("/topic/notifications")
    public ResponseEntity<?> returnMission(@RequestParam String referenceId, @RequestBody(required = false) MissionRequestReasonDto missionRequestReasonDto, Authentication authentication) {
        ResponseDto<MissionDetails> responseDto = new ResponseDto<>();
        Map<String, String> errors = new HashMap<>();

        // Check if authentication is null
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse("Unauthorized access", 401));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Optional<Employee> employees = employeeService.getEmployeeById(username);

        if (!employees.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse("No employee found", 404));
        }

        try {
            // Validate the reference ID
            if (referenceId == null || referenceId.isEmpty()) {
                errors.put("message", "Reference ID is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (missionRequestReasonDto == null || missionRequestReasonDto.getReason() == null || missionRequestReasonDto.getReason().isEmpty()) {
                errors.put("message", "Reason cannot be empty.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if(countWords(missionRequestReasonDto.getReason()) > 50) {
                errors.put("message", "Reason cannot exceed 50 words.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            // Fetch mission details by reference ID
            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);

            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }

            if (mssDetails.get().getStatus().equals(Status.MISSION_ORDER_RETURNED)) {
                errors.put("message", "Mission details was already returned");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (!mssDetails.get().getStatus().equals(Status.SUBMITTED_FOR_APPROVAL)) {
                errors.put("message", "The mission cannot be returned because it is not in the 'Submitted for Approval' status.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            MissionDetails missionDetails = mssDetails.get();

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();
            historyRecord.setStatus(Status.MISSION_ORDER_RETURNED);
            historyRecord.setPerformedBy(employees.get());
            historyRecord.setComment(missionRequestReasonDto.getReason());

            missionDetails.setStatus(Status.MISSION_ORDER_RETURNED);
            missionDetails.addHistory(historyRecord);

            MissionDetails saveMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);

            responseDto.setMessage("Mission returned successfully.");
            responseDto.setData(saveMissionDetails);

            Optional<Employee> employee = employeeService.getEmployeeById(missionDetails.getEmployee().getEmployeeId().toString());
            Optional<Employee> approver = employeeService.getEmployeeById(missionDetails.getApprover().getEmployeeId().toString());
            emailService.sendReturnEmail(employee.orElse(null), missionDetails);
    
            String approversName = approver.get().getGivenName() + " " +approver.get().getFamilyName();
            Notification notification = new Notification();
            notification.setEmployee(employee.orElse(null));
            notification.setTitle("Your mission order has been returned!");
            notification.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" has been returned by "+approversName+".");
            notification.setType(Status.MISSION_ORDER_RETURNED);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());

            notificationService.saveNotification(notification);

            if(saveMissionDetails.getRequester() != null) {
                Notification notificationRequestor = new Notification();
                notificationRequestor.setEmployee(missionDetails.getRequester());
                notificationRequestor.setTitle("Your mission order has been returned!");
                notificationRequestor.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" has been returned by "+approversName+".");
                notificationRequestor.setType(Status.MISSION_ORDER_RETURNED);
                notificationRequestor.setIsRead(false);
                notificationRequestor.setDate(LocalDateTime.now());
                notificationService.saveNotification(notificationRequestor);
            }

            return ResponseEntity.ok(responseDto);

        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid data format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while updating mission details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @PatchMapping("/cancel-mission")
    @SendTo("/topic/notifications")
    public ResponseEntity<?> cancelMission(@RequestParam String referenceId, @RequestBody(required = false) MissionRequestReasonDto missionRequestReasonDto, Authentication authentication) {
        ResponseDto<MissionDetails> responseDto = new ResponseDto<>();
        Map<String, String> errors = new HashMap<>();

        // Check if authentication is null
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse("Unauthorized access", 401));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Optional<Employee> employees = employeeService.getEmployeeById(username);

        if (!employees.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse("No employee found", 404));
        }

        try {
            // Validate the reference ID
            if (referenceId == null || referenceId.isEmpty()) {
                errors.put("message", "Reference ID is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (missionRequestReasonDto == null || missionRequestReasonDto.getReason() == null || missionRequestReasonDto.getReason().isEmpty()) {
                errors.put("message", "Reason cannot be empty.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if(countWords(missionRequestReasonDto.getReason()) > 50) {
                errors.put("message", "Reason cannot exceed 50 words.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            // Fetch mission details by reference ID
            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);

            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }

            if (mssDetails.get().getStatus().equals(Status.MISSION_ORDER_CLEARANCE_RECORD_CANCELLED)) {
                errors.put("message", "Mission details was already cancelled");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (!mssDetails.get().getStatus().equals(Status.APPROVED)) {
                errors.put("message", "The mission cannot be cancelled because it is not in the 'Approved' status.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            MissionDetails missionDetails = mssDetails.get();
            missionDetails.setStatus(Status.MISSION_ORDER_CLEARANCE_RECORD_CANCELLED);

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();
            historyRecord.setStatus(Status.MISSION_ORDER_CLEARANCE_RECORD_CANCELLED);
            historyRecord.setPerformedBy(employees.get());
            historyRecord.setComment(missionRequestReasonDto.getReason());

            missionDetails.addHistory(historyRecord);

            MissionDetails saveMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);

            responseDto.setMessage("Mission cancelled successfully.");
            responseDto.setData(saveMissionDetails);

            Optional<Employee> employee = employeeService.getEmployeeById(missionDetails.getEmployee().getEmployeeId().toString());
            Optional<Employee> approver = employeeService.getEmployeeById(missionDetails.getApprover().getEmployeeId().toString());

            emailService.sendCancelClearanceEmail(employee.orElse(null), missionDetails);

            String approversName = approver.get().getGivenName() + " " +approver.get().getFamilyName();
            Notification notification = new Notification();
            notification.setEmployee(employee.orElse(null));
            notification.setTitle("Your mission order has been cancelled!");
            notification.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" has been cancelled by "+approversName+". In case you may need additional information please do consult the head of your department");
            notification.setType(Status.MISSION_ORDER_CLEARANCE_RECORD_CANCELLED);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());

            notificationService.saveNotification(notification);

            if(saveMissionDetails.getRequester() != null) {
                Notification notificationRequestor = new Notification();
                notificationRequestor.setEmployee(missionDetails.getRequester());
                notificationRequestor.setTitle("Your mission order has been cancelled!");
                notificationRequestor.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" has been cancelled by "+approversName+". In case you may need additional information please do consult the head of your department");
                notificationRequestor.setType(Status.MISSION_ORDER_CLEARANCE_RECORD_CANCELLED);
                notificationRequestor.setIsRead(false);
                notificationRequestor.setDate(LocalDateTime.now());
                notificationService.saveNotification(notificationRequestor);
            }

            return ResponseEntity.ok(responseDto);

        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid data format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while updating mission details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @PostMapping("/cross-over-weekend-validate")
    public ResponseEntity<CrossOverResponse> validateMission(@RequestBody(required = false) CrossOverRequest crossOverRequest) {
        try {
            // Validate the request object
            if (crossOverRequest == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CrossOverResponse("Request cannot be null.", HttpStatus.BAD_REQUEST.value(), false));
            }

            // Validate startDate
            if (crossOverRequest.getStartDate() == null || crossOverRequest.getStartDate().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CrossOverResponse("Start date cannot be null or empty.", HttpStatus.BAD_REQUEST.value(), false));
            }

            // Validate endDate
            if (crossOverRequest.getEndDate() == null || crossOverRequest.getEndDate().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CrossOverResponse("End date cannot be null or empty.", HttpStatus.BAD_REQUEST.value(), false));
            }

            // Parse the dates
            LocalDate mainStartDate = LocalDate.parse(crossOverRequest.getStartDate(), DATE_FORMATTER);
            LocalDate mainEndDate = LocalDate.parse(crossOverRequest.getEndDate(), DATE_FORMATTER);

            // Check if the mission crosses over the weekend
            boolean isCrossedOverWeekend = MissionUtils.crossesWeekend(mainStartDate, mainEndDate);

            String message = isCrossedOverWeekend ? "The mission crosses over the weekend." : "The mission does not cross over the weekend.";
            int status = HttpStatus.OK.value();

            CrossOverResponse responseDto = new CrossOverResponse(message, status, isCrossedOverWeekend);

            return ResponseEntity.status(status).body(responseDto);
        } catch (Exception e) {
            // Log the exception (optional)
            e.printStackTrace(); // Replace with proper logging

            // Return a generic error response
            CrossOverResponse errorResponse = new CrossOverResponse(
                "An error occurred while validating the mission.",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                false
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PatchMapping("/compute-mission")
    @SendTo("/topic/notifications")
    public ResponseEntity<?> ComputeMission(@RequestParam String referenceId, @RequestBody(required = false) ComputeMissionRequest computeMissionRequest, Authentication authentication) {
        ResponseDto<MissionDetails> responseDto = new ResponseDto<>();
        Map<String, String> errors = new HashMap<>();

        // Check if authentication is null
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse("Unauthorized access", 401));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Optional<Employee> employees = employeeService.getEmployeeById(username);

        if (!employees.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse("No employee found", 404));
        }

        try {
            // Validate the reference ID
            if (referenceId == null || referenceId.isEmpty()) {
                errors.put("message", "Reference ID is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            // Fetch mission details by reference ID
            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);
            

            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }

            if (mssDetails.get().getStatus().equals(Status.MISSION_COMPUTED)) {
                errors.put("message", "Mission details was already computed");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (!mssDetails.get().getStatus().equals(Status.APPROVED)) {
                errors.put("message", "The mission cannot be computed because it is not in the 'APPROVAL' status.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (computeMissionRequest.getTransportMileageAllowance() == null) {
                errors.put("message", "Transport Mileage Allowance is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (computeMissionRequest.getTotalAmount() == null) {
                errors.put("message", "GetTotalAmount is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            MissionDetails missionDetails = mssDetails.get();

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();

            historyRecord.setStatus(Status.MISSION_COMPUTED);
            historyRecord.setPerformedBy(employees.get());
            historyRecord.setComment("Mission Computed");

            missionDetails.setDistance(computeMissionRequest.getDistance());
            missionDetails.setMileage(computeMissionRequest.getMileage());
            missionDetails.setTransportMileageAllowance(computeMissionRequest.getTransportMileageAllowance());
            missionDetails.setTotalAmount(computeMissionRequest.getTotalAmount());

            missionDetails.setStatus(Status.MISSION_COMPUTED);
            missionDetails.addHistory(historyRecord);

            MissionDetails saveMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);

            responseDto.setMessage("Mission computed successfully.");
            responseDto.setData(saveMissionDetails);

            Optional<Employee> employee = employeeService.getEmployeeById(missionDetails.getEmployee().getEmployeeId().toString());
            Optional<Employee> approver = employeeService.getEmployeeById(missionDetails.getApprover().getEmployeeId().toString());
            emailService.sendComputationEmail(employee.orElse(null), missionDetails);

            String approversName = approver.get().getGivenName() + " " +approver.get().getFamilyName();
            Notification notification = new Notification();
            notification.setEmployee(employee.orElse(null));
            notification.setTitle("Your mission order has been computed!");
            notification.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" has been computed by "+approversName+".");
            notification.setType(Status.MISSION_COMPUTED);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());

            notificationService.saveNotification(notification);

            if(saveMissionDetails.getRequester() != null) {
                Notification notificationRequestor = new Notification();
                notificationRequestor.setEmployee(missionDetails.getRequester());
                notificationRequestor.setTitle("Your mission order has been computed!");
                notificationRequestor.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" has been computed by "+approversName+".");
                notificationRequestor.setType(Status.MISSION_COMPUTED);
                notificationRequestor.setIsRead(false);
                notificationRequestor.setDate(LocalDateTime.now());
                notificationService.saveNotification(notificationRequestor);
            }

            return ResponseEntity.ok(responseDto);

        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid data format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while updating mission details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @PatchMapping("/cancel-computed-mission")
    @SendTo("/topic/notifications")
    public ResponseEntity<?> CancelComputeMission(@RequestParam String referenceId, Authentication authentication) {
        ResponseDto<MissionDetails> responseDto = new ResponseDto<>();
        Map<String, String> errors = new HashMap<>();

        // Check if authentication is null
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse("Unauthorized access", 401));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Optional<Employee> employees = employeeService.getEmployeeById(username);

        if (!employees.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse("No employee found", 404));
        }

        try {
            // Validate the reference ID
            if (referenceId == null || referenceId.isEmpty()) {
                errors.put("message", "Reference ID is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            // Fetch mission details by reference ID
            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);
            

            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }

            if (!mssDetails.get().getStatus().equals(Status.MISSION_COMPUTED)) {
                errors.put("message", "The mission cannot be cancelled because it is not in the 'Mission Computed' status.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            MissionDetails missionDetails = mssDetails.get();

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();

            historyRecord.setStatus(Status.MISSION_COMPUTATION_CANCELLED);
            historyRecord.setPerformedBy(employees.get());
            historyRecord.setComment("Mission Computation has been Cancelled");

            missionDetails.setDistance(null);
            missionDetails.setMileage(null);
            missionDetails.setTotalAmount(null);
            missionDetails.setTransportMileageAllowance(null);

            missionDetails.setStatus(Status.APPROVED);
            missionDetails.addHistory(historyRecord);

            MissionDetails saveMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);

            responseDto.setMessage("Mission Computation Cancelled successfully.");
            responseDto.setData(saveMissionDetails);

            Optional<Employee> employee = employeeService.getEmployeeById(missionDetails.getEmployee().getEmployeeId().toString());
            Optional<Employee> approver = employeeService.getEmployeeById(missionDetails.getApprover().getEmployeeId().toString());
            emailService.sendCancelComputationEmail(approver.orElse(null), missionDetails);

            Notification notification = new Notification();
            notification.setEmployee(employee.orElse(null));
            notification.setTitle("Mission Computation Has Been Cancelled!");
            notification.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" Computation Has Been Cancelled.");
            notification.setType(Status.MISSION_COMPUTED);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());

            Notification notification1 = new Notification();
            notification1.setEmployee(approver.orElse(null));
            notification1.setTitle("Mission Computation Has Been Cancelled!");
            notification1.setMessage("Mission order with reference "+saveMissionDetails.getReferenceId()+" Computation Has Been Cancelled.");
            notification1.setType(Status.MISSION_COMPUTED);
            notification1.setIsRead(false);
            notification1.setDate(LocalDateTime.now());

            notificationService.saveNotification(notification);
            notificationService.saveNotification(notification1);

            if(saveMissionDetails.getRequester() != null) {
                Notification notificationRequestor = new Notification();
                notificationRequestor.setEmployee(missionDetails.getRequester());
                notificationRequestor.setTitle("Mission Computation Has Been Cancelled!");
                notificationRequestor.setMessage("Mission order with reference "+saveMissionDetails.getReferenceId()+" Computation Has Been Cancelled.");
                notificationRequestor.setType(Status.MISSION_COMPUTED);
                notificationRequestor.setIsRead(false);
                notificationRequestor.setDate(LocalDateTime.now());
                notificationService.saveNotification(notificationRequestor);
            }

            return ResponseEntity.ok(responseDto);

        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid data format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while updating mission details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @PatchMapping("/approve-mission-report")
    @SendTo("/topic/notifications")
    public ResponseEntity<?> ApproveMissionReport(@RequestParam String referenceId, Authentication authentication) {
        ResponseDto<MissionDetails> responseDto = new ResponseDto<>();
        Map<String, String> errors = new HashMap<>();

        // Check if authentication is null
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse("Unauthorized access", 401));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Optional<Employee> employees = employeeService.getEmployeeById(username);

        if (!employees.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse("No employee found", 404));
        }

        try {
            // Validate the reference ID
            if (referenceId == null || referenceId.isEmpty()) {
                errors.put("message", "Reference ID is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            // Fetch mission details by reference ID
            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);
            

            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }

            if (mssDetails.get().getReportStatus().equals(ReportStatus.SUBMITTED) || mssDetails.get().getStatus().equals(Status.MISSION_REPORT_ACCEPTED)) {
                errors.put("message", "The mission report was already approved!.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (!mssDetails.get().getStatus().equals(Status.REPORTED)) {
                errors.put("message", "The mission cannot be cancelled because it is not in the 'Reported' status.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            MissionDetails missionDetails = mssDetails.get();

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();

            historyRecord.setStatus(Status.MISSION_REPORT_ACCEPTED);
            historyRecord.setPerformedBy(employees.get());
            historyRecord.setComment("Mission Report has been Accepted");

            missionDetails.setReportStatus(ReportStatus.SUBMITTED);
            missionDetails.setStatus(Status.MISSION_REPORT_ACCEPTED);
            missionDetails.addHistory(historyRecord);

            MissionDetails saveMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);

            responseDto.setMessage("Mission Report Accepted successfully.");
            responseDto.setData(saveMissionDetails);

            emailService.sendMissionReportedApprovedEmail(missionDetails);

            String approversName = missionDetails.getApprover().getGivenName() + " " +missionDetails.getApprover().getFamilyName();
            Notification notification = new Notification();
            notification.setEmployee(missionDetails.getEmployee());
            notification.setTitle("Mission Report Has Been Accepted!");
            notification.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" Report Has Been Accepted by "+approversName+".");
            notification.setType(Status.REPORTED);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());
            notificationService.saveNotification(notification);

            if(saveMissionDetails.getRequester() != null) {
                Notification notificationRequestor = new Notification();
                notificationRequestor.setEmployee(missionDetails.getRequester());
                notificationRequestor.setTitle("Your mission report has been Accepted!");
                notificationRequestor.setMessage("Your mission order with reference "+saveMissionDetails.getReferenceId()+" Report Has Been Accepted by "+approversName+".");
                notificationRequestor.setType(Status.REPORTED);
                notificationRequestor.setIsRead(false);
                notificationRequestor.setDate(LocalDateTime.now());
                notificationService.saveNotification(notificationRequestor);
            }

            return ResponseEntity.ok(responseDto);

        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid data format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while updating mission details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @PatchMapping("/reject-mission-report")
    @SendTo("/topic/notifications")
    public ResponseEntity<?> RejectMissionReport(@RequestParam String referenceId, @RequestParam(required = false, name = "reason") String reason, Authentication authentication) {
        ResponseDto<MissionDetails> responseDto = new ResponseDto<>();
        Map<String, String> errors = new HashMap<>();

        // Check if authentication is null
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse("Unauthorized access", 401));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Optional<Employee> employees = employeeService.getEmployeeById(username);

        if (!employees.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse("No employee found", 404));
        }

        try {
            // Validate the reference ID
            if (referenceId == null || referenceId.isEmpty()) {
                errors.put("message", "Reference ID is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (reason == null || reason.isEmpty()) {
                errors.put("message", "Reason cannot be empty.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            // Fetch mission details by reference ID
            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);
            
            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }
            
            if (mssDetails.get().getReportStatus().equals(ReportStatus.SUBMITTED)) {
                errors.put("message", "The mission report was already approved!. you can't reject it");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }
            
            if (!mssDetails.get().getStatus().equals(Status.REPORTED)) {
                errors.put("message", "The mission cannot be cancelled because it is not in the 'Reported' status.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            MissionDetails missionDetails = mssDetails.get();
            
            MissionHistoryRecord historyRecord = new MissionHistoryRecord();

            historyRecord.setStatus(Status.MISSION_REPORT_CANCELLED);
            historyRecord.setPerformedBy(employees.get());
            historyRecord.setComment("Mission Report has been Cancelled");


            if(missionDetails.getMissionFiles()!=null) {
                Iterator<MissionFile> iterator = missionDetails.getMissionFiles().iterator();
                while (iterator.hasNext()) {
                    MissionFile missionFile = iterator.next();
                    if (missionFile.getMissionDocType() == DocType.REPORT) {
                        iterator.remove();
                    }
                }
            }

            missionDetails.setReportSummary(null);
            missionDetails.setStatus(Status.MISSION_PAYMENT_BATCH_CREATED);
            missionDetails.addHistory(historyRecord);

            MissionDetails saveMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);

            responseDto.setMessage("Mission report Cancelled successfully.");
            responseDto.setData(saveMissionDetails);

            emailService.sendMissionReportRejectedEmail(missionDetails, reason);

            String approversName = employees.get().getGivenName() + " " +employees.get().getFamilyName();
            Notification notification = new Notification();
            notification.setEmployee(missionDetails.getEmployee());
            notification.setTitle("Your mission report has been Cancelled!");
            notification.setMessage("Your mission report with reference "+saveMissionDetails.getReferenceId()+" has been Cancelled by "+approversName+". In case you may need additional information please do consult the head of your department");
            notification.setType(Status.REPORTED);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());

            if(saveMissionDetails.getRequester() != null) {
                Notification notificationRequestor = new Notification();
                notificationRequestor.setEmployee(missionDetails.getRequester());
                notificationRequestor.setTitle("Your mission report has been Cancelled!");
                notificationRequestor.setMessage("Your mission report with reference "+saveMissionDetails.getReferenceId()+" has been Cancelled by "+approversName+". In case you may need additional information please do consult the head of your department");
                notificationRequestor.setType(Status.REPORTED);
                notificationRequestor.setIsRead(false);
                notificationRequestor.setDate(LocalDateTime.now());
                notificationService.saveNotification(notificationRequestor);
            }

            notificationService.saveNotification(notification);
            return ResponseEntity.ok(responseDto);

        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid data format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while updating mission details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }
}

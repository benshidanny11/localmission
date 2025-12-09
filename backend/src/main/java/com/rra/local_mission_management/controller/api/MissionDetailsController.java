package com.rra.local_mission_management.controller.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rra.local_mission_management.dto.request.MissionAllowanceDistrictDTO;
import com.rra.local_mission_management.dto.request.MissionDestinationDTO;
import com.rra.local_mission_management.dto.request.MissionDetailsDTO;
import com.rra.local_mission_management.dto.request.PlacementDTO;
import com.rra.local_mission_management.dto.responce.MissionSuccessResponse;
import com.rra.local_mission_management.dto.responce.ResponseDto;
import com.rra.local_mission_management.dto.responce.ApiResponse;
import com.rra.local_mission_management.dto.responce.MissionErrorResponse;
import com.rra.local_mission_management.dto.responce.MissionFetchError;
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
import com.rra.local_mission_management.service.MissionHistoryServices;
import com.rra.local_mission_management.service.MissionLocationService;
import com.rra.local_mission_management.service.NotificationService;
import com.rra.local_mission_management.service.PlacementService;
import com.rra.local_mission_management.service.SequenceGeneratorService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;


@RestController
@RequestMapping("/api/v1/missionDetails")
public class MissionDetailsController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private MissionDetailsService missionDetailsService;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private MissionAllowanceServices missionAllowanceService;

    @Autowired
    private DistrictService districtService;

    @Autowired
    private MissionHistoryServices missionHistoryServices;

    @Autowired
    private MissionLocationService missionLocationService;

    @Autowired
    private MissionAllowanceServiceRepo missionAllowanceServiceRepo;

    @Autowired
    private PlacementService placementService;

    @Autowired GradeService gradeService;

    @GetMapping
    public List<MissionDetails> getAllMissionDetails() {
        return missionDetailsService.getAllMissionDetails();
    }

    // Get MissionDetails by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMissionDetailsById(@PathVariable Long id) {
        Optional<MissionDetails> missionDetails = missionDetailsService.getMissionDetailsById(id);
        if (missionDetails.isPresent()) {
            return ResponseEntity.ok(missionDetails.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new MissionFetchError("MissionDetails not found", 404));
        }
    }

    // Get MissionDetails by Employee ID
    @GetMapping("/my-missions")
    public ResponseEntity<?> getMissionDetailsByEmployeeId(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new MissionFetchError("An error occurred while fetching mission details: ", 500));
        }
        
        ResponseDto<List<MissionDetails>> responseDto = new ResponseDto<>();
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            String username = userDetails.getUsername();

            // Attempt to parse the username as a Long (assuming username is actually an employee ID)
            Employee employee = employeeService.getEmployeeById(username).get();

            // Fetch mission details by employee ID
            List<MissionDetails> missionDetails = missionDetailsService.getMissionDetailsByEmployeeId(employee);

            responseDto.setMessage("Missions retrieved successfully");
            responseDto.setData(missionDetails);
            return ResponseEntity.ok(responseDto);

        } catch (NumberFormatException e) {
            // Handle the case where the username cannot be parsed into a Long
            return ResponseEntity.badRequest()
                                .body(new MissionFetchError("Invalid employee ID format: " + e.getMessage(), 400));

        } catch (Exception e) {
            // Handle any other unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new MissionFetchError("An error occurred while fetching mission details: " + e.getMessage(), 500));
        }
    }
    
    @GetMapping("/mission-for-payment-batch")
    public ResponseEntity<?> getMissionDetailsForPaymentBatch() {
        
        ResponseDto<List<MissionDetails>> responseDto = new ResponseDto<>();
        try {
            List<MissionDetails> missionDetails = missionDetailsService.findComputedMissionsWithoutPaymentBatch();

            responseDto.setMessage("Missions retrieved successfully");
            responseDto.setData(missionDetails);
            return ResponseEntity.ok(responseDto);

        } catch (Exception e) {
            // Handle any other unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new MissionFetchError("An error occurred while fetching mission details: " + e.getMessage(), 500));
        }
    }

    // Search MissionDetails by Employee ID and Reference ID
    @GetMapping("/search")
    public ResponseEntity<?> searchMissionDetails(@RequestParam Long employeeId, @RequestParam String referenceId) {
        Employee employee = employeeService.getEmployeeById(employeeId.toString(0)).get();
        List<MissionDetails> missionDetails = missionDetailsService.searchMissionDetailsByEmployeeIdAndReferenceId(employee, referenceId);
        if (!missionDetails.isEmpty()) {
            return ResponseEntity.ok(missionDetails);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new MissionFetchError("No MissionDetails found for the given employee ID and reference ID", 404));
        }
    }

    @GetMapping("/unsubmitted-report-check")
    public ResponseEntity<?> checkForUnSubmitted(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            Employee employee = employeeService.getEmployeeById(userDetails.getUsername()).get();
            List<MissionDetails> unsubmittedMission = missionDetailsService.getPendingMissionsForEmployee(employee);
            
            if (!unsubmittedMission.isEmpty()) {
                
                String message = formatUnsubmittedMissionMessage(
                        unsubmittedMission, employee);

                return ResponseEntity.status(HttpStatus.OK)
                    .body(new MissionFetchError(message, HttpStatus.CONFLICT.value()));
            } else {
                return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse("No unsubmitted reports found for the user.", HttpStatus.OK.value()));
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse("Invalid employee ID format.", HttpStatus.BAD_REQUEST.value()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    

    // Get MissionDetails by Reference ID
    @GetMapping("/reference")
    public ResponseEntity<?> getMissionDetailsByReferenceId(@RequestParam String referenceId) {
        Optional<MissionDetails> missionDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);
        if (missionDetails.isPresent()) {
            return ResponseEntity.ok(missionDetails.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new MissionFetchError("MissionDetails not found for the given reference ID", 404));
        }
    }

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SendTo("/topic/notifications")
    public ResponseEntity<?> createMissionDetails(Authentication authentication, @RequestParam("missionFiles") List<MultipartFile> missionFiles, @RequestParam("missionDetail") String missionDetail) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new MissionFetchError("An error occurred while fetching mission details: ", 500));
        }
        try {

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            String username = userDetails.getUsername();
            Employee owner = employeeService.getEmployeeById(username).get();

            ObjectMapper objectMapper = new ObjectMapper();
            MissionDetailsDTO missionDetailsDTO = objectMapper.readValue(missionDetail, MissionDetailsDTO.class);

            Optional<Employee> employee = employeeService.getEmployeeById(missionDetailsDTO.getEmployeeId());
            Optional<Employee> approver = employeeService.getEmployeeById(missionDetailsDTO.getApproverId());
            Optional<Employee> proposer = employeeService.getEmployeeById(missionDetailsDTO.getProposerId());

            // Validate employees
            if (!employee.isPresent()) {
                MissionErrorResponse errorResponse = new MissionErrorResponse("Employee not found", HttpStatus.BAD_REQUEST.value());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            if (!approver.isPresent()) {
                MissionErrorResponse errorResponse = new MissionErrorResponse("Approver not found", HttpStatus.BAD_REQUEST.value());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            if (!proposer.isPresent()) {
                MissionErrorResponse errorResponse = new MissionErrorResponse("Proposer not found", HttpStatus.BAD_REQUEST.value());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            
            List<MissionDetails> unsubmittedMission = missionDetailsService.getPendingMissionsForEmployee(employee.get());
            
            if (!unsubmittedMission.isEmpty()) {
                
                String message = formatUnsubmittedMissionMessage(
                        unsubmittedMission, employee.get());

                return ResponseEntity.status(HttpStatus.OK)
                    .body(new MissionFetchError(message, HttpStatus.CONFLICT.value()));
            }

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

            Map<String, String> errors = validateMissionDetails(missionDetailsDTO);

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            Optional<District> missionPlace = missionLocationService.getDistrictByName(missionDetailsDTO.getPlace());
            if(!missionPlace.isPresent()) {
                ApiResponse errorResponse = new ApiResponse("District "+missionDetailsDTO.getPlace()+" is not found", HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(errorResponse);
            }

            errors.putAll(validateMissionDestinations(missionDetailsDTO.getMissionDestinations(), missionPlace.get().getDistrictCode()));

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            LocalDate mainStartDate = LocalDate.parse(missionDetailsDTO.getStartDate(), DATE_FORMATTER);
            LocalDate mainEndDate = LocalDate.parse(missionDetailsDTO.getEndDate(), DATE_FORMATTER);

            if (!missionDetailsDTO.getMissionDestinations().isEmpty()) {
                MissionDestinationDTO firstDestination = missionDetailsDTO.getMissionDestinations().get(0);
                MissionDestinationDTO lastDestination = missionDetailsDTO.getMissionDestinations().get(missionDetailsDTO.getMissionDestinations().size() - 1);

                LocalDate firstDestinationStartDate = LocalDate.parse(firstDestination.getStartDate(), DATE_FORMATTER);
                LocalDate lastDestinationEndDate = LocalDate.parse(lastDestination.getEndDate(), DATE_FORMATTER);

                if (!mainStartDate.isEqual(firstDestinationStartDate)) {
                    errors.put("startDate", "The startDate of the mission must match the startDate of the first destination.");
                }

                if (!mainEndDate.isEqual(lastDestinationEndDate)) {
                    errors.put("endDate", "The endDate of the mission must match the endDate of the last destination.");
                }
            }

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            PlacementDTO placementDTO = placementService.getStructureWithJobMasterAndGradeByEmployeeId(employee.get().getEmployeeId());

            int gradeId = placementDTO.getJobMaster().getGrade().getGradeId();

            if (gradeId == 1 || gradeId == 2 || gradeId == 3 || gradeId == 4) {
                if("PUBLIC_CAR".equalsIgnoreCase(missionDetailsDTO.getTransportMode())) {
                    ApiResponse errorResponse = new ApiResponse("For E3, E2, E1, M3 Staffs cannot use PUBLIC CAR", HttpStatus.BAD_REQUEST.value());
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }else {
                if("PRIVATE_CAR".equalsIgnoreCase(missionDetailsDTO.getTransportMode())) {
                    ApiResponse errorResponse = new ApiResponse("Except E3, E2, E1, M3 Staffs Others cannot use PRIVATE CAR", HttpStatus.BAD_REQUEST.value());
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            List<MissionAllowanceDistrictDTO> missionAllowances = new ArrayList<>();
            for (MissionDestinationDTO destinationDTO : missionDetailsDTO.getMissionDestinations()) {
                MissionAllowanceDistrictDTO missionDestination = new MissionAllowanceDistrictDTO();
                missionDestination.setDistrictId(Integer.parseInt(destinationDTO.getDistrictId()));
                missionDestination.setNumberOfDays(destinationDTO.getNumberOfDays());
                missionDestination.setNumberOfNights(destinationDTO.getNumberOfNights());
                missionAllowances.add(missionDestination);
            }

            String missionAllowanceJson = convertToJson(missionAllowances);
            Object result = missionAllowanceService.calculateAllowance(missionDetailsDTO.getEmployeeId(), missionAllowanceJson);

            
        
            String referenceId = sequenceGeneratorService.generateReferenceId();

            MissionDetails missionDetails = new MissionDetails();
            missionDetails.setReferenceId(referenceId);
            missionDetails.setEmployee(employee.get());
            missionDetails.setApprover(approver.get());
            missionDetails.setProposer(proposer.get());

            if (owner != employee.get()) {
                missionDetails.setRequester(owner);
            }
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate startDate = LocalDate.parse(missionDetailsDTO.getStartDate(), formatter);
            LocalDate endDate = LocalDate.parse(missionDetailsDTO.getEndDate(), formatter);

            missionDetails.setStartDate(startDate);
            missionDetails.setEndDate(endDate);
            missionDetails.setPurposeOfMission(missionDetailsDTO.getPurposeOfMission());
            missionDetails.setExpectedResults(missionDetailsDTO.getExpectedResults());
            missionDetails.setMissionDays(missionDetailsDTO.getMissionDays());
            missionDetails.setMissionNights(missionDetailsDTO.getMissionNights());
            missionDetails.setTransportMode(TransportMode.valueOf(missionDetailsDTO.getTransportMode()));

            if(TransportMode.valueOf(missionDetailsDTO.getTransportMode()).equals(TransportMode.TRANSPORT_SPONSOR)) {
                missionDetails.setTransportMileageAllowance(0.0);
            }

            missionDetails.setPlace(missionDetailsDTO.getPlace());


            Grade grade = gradeService.getGradeById(gradeId).get();
            Optional<MissionAllowance> missionAllowance = missionAllowanceServiceRepo.getAllowanceByGrade(grade);

            for (MissionDestinationDTO destinationDTO : missionDetailsDTO.getMissionDestinations()) {
                MissionDestination missionDestination = new MissionDestination();
                
                Optional<MissionLocation> missionLocation = missionLocationService.getMissionLocationsByDistrictId(Integer.parseInt(destinationDTO.getDistrictId()));
                if(!missionLocation.isPresent()) {
                    ApiResponse errorResponse = new ApiResponse("District with "+Integer.parseInt(destinationDTO.getDistrictId())+" is not found", HttpStatus.BAD_REQUEST.value());
                    return ResponseEntity.badRequest().body(errorResponse);
                }

                String nightRate = getZoneByNumber(missionAllowance.get(), missionLocation.get().getZone());
                Optional<District> district = districtService.getDistrictByCode(Integer.parseInt(destinationDTO.getDistrictId()));
                missionDestination.setDistrict(district.get());
                missionDestination.setStartDate(LocalDate.parse(destinationDTO.getStartDate(), formatter));
                missionDestination.setEndDate(LocalDate.parse(destinationDTO.getEndDate(), formatter));
                missionDestination.setNumberOfDays(destinationDTO.getNumberOfDays());
                missionDestination.setNumberOfNights(destinationDTO.getNumberOfNights());
                missionDestination.setDayRate(missionAllowance.get().getDailyAllowance());
                missionDestination.setNightRate(nightRate);
                missionDetails.addMissionDestination(missionDestination);
            }

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();
            historyRecord.setStatus(Status.SUBMITTED_FOR_APPROVAL);
            historyRecord.setPerformedBy(employee.get());
            historyRecord.setComment("Mission Submitted for approval");

            missionDetails.addHistory(historyRecord);

            for (MultipartFile missionFile : missionFiles) {

                String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
                String newFileName = String.format("%s-%s-%s.pdf", missionDetailsDTO.getEmployeeId(), UUID.randomUUID().toString(), currentDate);
                MissionFile missionFileOb = new MissionFile();
                missionFileOb.setMissionFile(newFileName);
                missionFileOb.setMissionDocType(DocType.SUPPORT);
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

            // Handle other properties as needed
            missionDetails.setMissionAllowance(Double.parseDouble(result.toString()));
            missionDetails.setTotalAmount(Double.parseDouble(result.toString()));


            List<String> validTransportModes = Arrays.asList("PRIVATE_CAR");
            
            if (validTransportModes.contains(missionDetailsDTO.getTransportMode())) {
                missionDetails.setPlate(missionDetailsDTO.getPlate());
            } else {
                missionDetails.setPlate(null);
            }

            missionDetails.setCreatedAt(LocalDateTime.now());
            missionDetailsService.validateMissionOverlap(missionDetails);
            MissionDetails savedMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);
            MissionSuccessResponse successResponse = new MissionSuccessResponse("Mission details created successfully", savedMissionDetails, HttpStatus.CREATED.value());
            
            emailService.sendMissionRequestEmail(missionDetails, employee.get(), approver.get());

            String employeeNames = employee.get().getGivenName() +" "+employee.get().getFamilyName();
            Notification notification = new Notification();
            notification.setEmployee(approver.get());
            notification.setTitle("Mission for approval requested");
            notification.setMessage("Mission request with referenceID "+referenceId+" for "+employeeNames+" is awaiting your approval.");
            notification.setReferenceId(referenceId);
            notification.setType(Status.SUBMITTED_FOR_APPROVAL);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());

            notificationService.saveNotification(notification);


            return new ResponseEntity<>(successResponse, HttpStatus.CREATED);

        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new MissionFetchError(e.getMessage(), 500));
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

    private Map<String, String> validateMissionDetails(MissionDetailsDTO missionDetailsDTO) {
        Map<String, String> errors = new HashMap<>();

        LocalDate startDate = parseDate(missionDetailsDTO.getStartDate(), errors, "startDate");
        LocalDate endDate = parseDate(missionDetailsDTO.getEndDate(), errors, "endDate");

        if (startDate != null && endDate != null) {
            if (startDate.isBefore(LocalDate.now()) || endDate.isBefore(LocalDate.now())) {
                errors.put("message", "Both startDate and endDate must be in the future");
                return errors;
            }

            if (startDate.isAfter(endDate)) {
                errors.put("message", "startDate must be before endDate");
                return errors;
            }

            long missionDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
            // long missionNights = missionDays - 1;
            long missionNights = missionDetailsDTO.getMissionNights();

            if (missionDetailsDTO.getMissionDays() != missionDays) {
                errors.put("message", "Invalid missionDays. Expected: " + missionDays);
                return errors;
            }

            if (missionDetailsDTO.getMissionNights() != missionNights) {
                errors.put("message", "Invalid missionNights. Expected: " + missionNights);
                return errors;
            }
        }

        if (missionDetailsDTO.getPurposeOfMission() == null || countWords(missionDetailsDTO.getPurposeOfMission()) > 150) {
            errors.put("message", "Purpose of mission must be min 150 words");
            return errors;
        }

        if (missionDetailsDTO.getExpectedResults() == null || countWords(missionDetailsDTO.getExpectedResults()) > 90) {
            errors.put("message", "Expected results must be at min 90 words");
            return errors;
        }

        if (missionDetailsDTO.getPlace() == null || missionDetailsDTO.getPlace().trim().isEmpty()) {
            errors.put("message", "Place cannot be null or empty");
            return errors;
        }

        try {
            TransportMode.valueOf(missionDetailsDTO.getTransportMode());
        } catch (IllegalArgumentException e) {
            String validTransportModes = Arrays.stream(TransportMode.values())
                                               .map(Enum::name)
                                               .collect(Collectors.joining(", "));
            errors.put("message", "Invalid transport mode. Accepted values are: " + validTransportModes);
            return errors;
        }

        List<String> validTransportModes = Arrays.asList("PRIVATE_CAR");
        if (validTransportModes.contains(missionDetailsDTO.getTransportMode())) {
            if (missionDetailsDTO.getPlate() == null || missionDetailsDTO.getPlate().length() != 7) {
                errors.put("message", "For Private car transport mode, plate must be 7 characters long (e.g., RAB123V)");
                return errors;
            }
        } else if (missionDetailsDTO.getPlate() != null && !missionDetailsDTO.getPlate().isEmpty()) {
            errors.put("message", "Plate should be null or empty for public car, RRA vehicle and hired car transport modes");
            return errors;
        }

        return errors;
    }

    private Map<String, String> validateMissionDestinations(List<MissionDestinationDTO> missionDestinations, int districtId) {
        Map<String, String> errors = new HashMap<>();

        if (missionDestinations == null || missionDestinations.isEmpty()) {
            errors.put("missionDestinations", "At least one mission destination must be provided");
            return errors;
        }

        LocalDate today = LocalDate.now();
        LocalDate previousEndDate = null;

        for (int i = 0; i < missionDestinations.size(); i++) {
            MissionDestinationDTO destination = missionDestinations.get(i);

            LocalDate startDate = parseDate(destination.getStartDate(), errors, "missionDestinations[" + i + "].startDate");
            LocalDate endDate = parseDate(destination.getEndDate(), errors, "missionDestinations[" + i + "].endDate");

            if (startDate != null && endDate != null) {
                if (startDate.isBefore(today) || endDate.isBefore(today)) {
                    errors.put("message", "Dates for row number "+(i+1)+" must be in the future");
                    return errors;
                }

                if (startDate.isAfter(endDate)) {
                    errors.put("message", "startDate for row number "+(i+1)+" must be before endDate");
                    return errors;
                }

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
            errors.put(fieldName, "Invalid date format. Use dd/MM/yyyy");
            return null;
        }
    }

    private int countWords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }
        return text.trim().split("\\s+").length;
    }

    private String formatUnsubmittedMissionMessage(List<MissionDetails> unsubmittedMissions, Employee employee) {
        StringBuilder messageBuilder = new StringBuilder();
    
        String staffCode = employee.getEmployeeId();
        String employeeName = employee.getFamilyName() + " " + employee.getGivenName();
    
        messageBuilder.append("Dear ")
                      .append(staffCode).append(" ").append(employeeName)
                      .append(", You cannot make a request for a mission order as you have ")
                      .append(unsubmittedMissions.size())
                      .append(" mission order(s) not reported. Below are the details:");
    
        for (MissionDetails mission : unsubmittedMissions) {
            LocalDate returnDate = mission.getEndDate();
            long daysDelayed = ChronoUnit.DAYS.between(returnDate.plusDays(8), LocalDate.now());
    
            messageBuilder.append("\n* ")
                          .append("Travel clearance ref: ").append(mission.getReferenceId())
                          .append(", with return date: ").append(returnDate)
                          .append(", delayed by ").append(daysDelayed).append(" days.");
        }
    
        return messageBuilder.toString();
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

    @GetMapping("/get-mission-history")
    public ResponseEntity<?> getMissionHistory(@RequestParam String referenceId) {
        ResponseDto<List<MissionHistoryRecord>> responseDto = new ResponseDto<>();
        try {
            Optional<MissionDetails> missionDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);
            if (!missionDetails.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body(new MissionFetchError("MissionDetails not found for the given reference ID", 404));
            }
            List<MissionHistoryRecord> missionHistoryRecords = missionHistoryServices.getByHistoryRecordsByMissionDetails(missionDetails.get());
            responseDto.setMessage("Mission record history");
            responseDto.setData(missionHistoryRecords);
            return ResponseEntity.ok(responseDto);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new MissionFetchError(e.getMessage(), 500));
        }
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<?> handleMissingServletRequestPartException(MissingServletRequestPartException ex) {
        ApiResponse errorResponse = new ApiResponse("Required part 'missionFiles' is not present.", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @PatchMapping(value = "/submit-report", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SendTo("/topic/notifications")
    public ResponseEntity<?> submitReport(@RequestParam String referenceId, @RequestParam("reportFiles") List<MultipartFile> reportFiles, @RequestParam("summary") String summary) {

        Map<String, String> errors = new HashMap<>();

        if (summary == null || summary.trim().isEmpty()) {
            errors.put("summary", "Summary is required and cannot be empty.");
            return ResponseEntity.badRequest().body(errors);
        }
    
        if (reportFiles == null || reportFiles.size() < 1) {
            ApiResponse errorResponse = new ApiResponse("Exactly one files must be provided.", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(errorResponse);
        }

        try {

            for (MultipartFile missionFile : reportFiles) {
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

            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);

            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }

            if (!mssDetails.get().getStatus().equals(Status.MISSION_PAYMENT_BATCH_CREATED)) {
                errors.put("message", "The mission cannot be reported because it is not in the 'MISSION PAYMENT BATCH CREATED' status.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            MissionDetails missionDetails = mssDetails.get();

            for (MultipartFile missionFile : reportFiles) {

                String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
                String newFileName = String.format("%s-%s-%s.pdf", missionDetails.getEmployee().getEmployeeId(), UUID.randomUUID().toString(), currentDate);
                MissionFile missionFileOb = new MissionFile();
                missionFileOb.setMissionFile(newFileName);
                missionFileOb.setMissionDocType(DocType.REPORT);
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

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();

            historyRecord.setStatus(Status.REPORTED);
            historyRecord.setPerformedBy(missionDetails.getEmployee());
            
            historyRecord.setComment(summary);
            missionDetails.addHistory(historyRecord);

            missionDetails.setStatus(Status.REPORTED);
            missionDetails.setReportSummary(summary);

            MissionDetails savedMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);
            MissionSuccessResponse successResponse = new MissionSuccessResponse("Mission reported successfully", savedMissionDetails, HttpStatus.CREATED.value());
            
            emailService.sendMissionReportedEmail(missionDetails);

            Notification notification = new Notification();
            notification.setEmployee(missionDetails.getApprover());
            notification.setTitle("Mission Reported");
            notification.setMessage("Mission request with referenceID "+referenceId+" has been reported");
            notification.setReferenceId(referenceId);
            notification.setType(Status.REPORTED);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());

            notificationService.saveNotification(notification);


            return new ResponseEntity<>(successResponse, HttpStatus.OK);

        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new MissionFetchError(e.getMessage(), 500));
        }
    }

    @PatchMapping("/cancel-mission-report")
    @SendTo("/topic/notifications")
    public ResponseEntity<?> CancelMissionReport(@RequestParam String referenceId, Authentication authentication) {
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

            if (mssDetails.get().getReportStatus().equals(ReportStatus.SUBMITTED) && !mssDetails.get().getStatus().equals(Status.REPORTED)) {
                errors.put("message", "The mission report was already approved!. you can't cancel it");
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


            Iterator<MissionFile> iterator = missionDetails.getMissionFiles().iterator();
            while (iterator.hasNext()) {
                MissionFile missionFile = iterator.next();
                if (missionFile.getMissionDocType() == DocType.REPORT) {
                    iterator.remove();
                }
            }

            missionDetails.setReportSummary(null);
            missionDetails.setStatus(Status.MISSION_PAYMENT_BATCH_CREATED);
            missionDetails.addHistory(historyRecord);

            MissionDetails saveMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);

            responseDto.setMessage("Mission Report Cancelled successfully.");
            responseDto.setData(saveMissionDetails);

            return ResponseEntity.ok(responseDto);

        } catch (NumberFormatException e) {
            responseDto.setMessage("Invalid data format.");
            return ResponseEntity.badRequest().body(responseDto);
        } catch (Exception e) {
            responseDto.setMessage("An error occurred while updating mission details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @PatchMapping(value = "/submit-refund-claim", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SendTo("/topic/notifications")
    public ResponseEntity<?> submitRefundClaim(@RequestParam String referenceId, @RequestParam(name = "claimFile", required = false) List<MultipartFile> claimFile, @RequestParam(name = "summary", required = false) String summary, @RequestParam(name = "amount", required = false) Double amount) {

        Map<String, String> errors = new HashMap<>();

        if (amount == null || amount == 0) {
            errors.put("amount", "Amount is required and cannot be empty.");
            return ResponseEntity.badRequest().body(errors);
        }


        if (summary == null || summary.trim().isEmpty()) {
            errors.put("summary", "Summary is required and cannot be empty.");
            return ResponseEntity.badRequest().body(errors);
        }
    
        if (claimFile == null || claimFile.size() == 0) {
            ApiResponse errorResponse = new ApiResponse("One file must be provided.", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(errorResponse);
        }

        try {

            for (MultipartFile missionFile : claimFile) {
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

            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);

            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }

            if (mssDetails.get().getStatus().equals(Status.CLAIM_SUBMITTED)) {
                errors.put("message", "The mission order has already been processed for a refund claim.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }


            if (!mssDetails.get().getStatus().equals(Status.MISSION_REPORT_ACCEPTED)) {
                errors.put("message", "The mission cannot be claimed because it is not in the 'Mission report accepted' status.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            MissionDetails missionDetails = mssDetails.get();

            for (MultipartFile missionFile : claimFile) {

                String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
                String newFileName = String.format("%s-%s-%s.pdf", missionDetails.getEmployee().getEmployeeId(), UUID.randomUUID().toString(), currentDate);
                MissionFile missionFileOb = new MissionFile();
                missionFileOb.setMissionFile(newFileName);
                missionFileOb.setMissionDocType(DocType.REFUND);
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

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();

            historyRecord.setStatus(Status.CLAIM_SUBMITTED);
            historyRecord.setPerformedBy(missionDetails.getEmployee());
            historyRecord.setComment(summary);

            missionDetails.setStatus(Status.CLAIM_SUBMITTED);
            missionDetails.setClaimSummary(summary);
            missionDetails.setClaimAmount(amount);
            missionDetails.addHistory(historyRecord);

            MissionDetails savedMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);
            MissionSuccessResponse successResponse = new MissionSuccessResponse("Mission Refund Claim Processed Successfully", savedMissionDetails, HttpStatus.CREATED.value());
            
            emailService.sendMissionClaimEmail(missionDetails);


            return new ResponseEntity<>(successResponse, HttpStatus.OK);

        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new MissionFetchError(e.getMessage(), 500));
        }
    }
    
    @PatchMapping(value = "/resubmit-mission-request", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SendTo("/topic/notifications")
    public ResponseEntity<?> resubmitMissionDetails(@RequestParam String referenceId,@RequestParam("missionFiles") List<MultipartFile> missionFiles, @RequestParam("missionDetail") String missionDetail) {
        Map<String, String> errors = new HashMap<>();
        try {
            
            if (referenceId == null || referenceId.isEmpty()) {
                errors.put("message", "Reference ID is required.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }
            
            Optional<MissionDetails> mssDetails = missionDetailsService.getMissionDetailsByReferenceId(referenceId);
            if (!mssDetails.isPresent()) {
                errors.put("message", "Mission details not found for the given reference ID.");
                return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            }

            

            MissionDetails missionDetails = mssDetails.get();

            // if (!missionDetails.getStatus().equals(Status.MISSION_ORDER_RETURNED)) {
            //     errors.put("message", "Mission request should be in status 'Mission Order Returned'.");
            //     return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
            // }

            missionDetails.getMissionFiles().clear();
            missionDetails.getMissionDestinations().clear();
            missionDetails.setStatus(Status.SUBMITTED_FOR_APPROVAL);

            ObjectMapper objectMapper = new ObjectMapper();
            MissionDetailsDTO missionDetailsDTO = objectMapper.readValue(missionDetail, MissionDetailsDTO.class);
            errors.putAll(validateMissionDetails(missionDetailsDTO));

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            Optional<Employee> employee = employeeService.getEmployeeById(missionDetailsDTO.getEmployeeId());
            Optional<Employee> approver = employeeService.getEmployeeById(missionDetailsDTO.getApproverId());
            Optional<Employee> proposer = employeeService.getEmployeeById(missionDetailsDTO.getProposerId());
            
            // Validate employees
            if (!employee.isPresent()) {
                MissionErrorResponse errorResponse = new MissionErrorResponse("Employee not found", HttpStatus.BAD_REQUEST.value());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            if (!approver.isPresent()) {
                MissionErrorResponse errorResponse = new MissionErrorResponse("Approver not found", HttpStatus.BAD_REQUEST.value());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            if (!proposer.isPresent()) {
                MissionErrorResponse errorResponse = new MissionErrorResponse("Proposer not found", HttpStatus.BAD_REQUEST.value());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }


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


            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            Optional<District> missionPlace = missionLocationService.getDistrictByName(missionDetailsDTO.getPlace());
            if(!missionPlace.isPresent()) {
                ApiResponse errorResponse = new ApiResponse("District "+missionDetailsDTO.getPlace()+" is not found", HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(errorResponse);
            }

            errors.putAll(validateMissionDestinations(missionDetailsDTO.getMissionDestinations(), missionPlace.get().getDistrictCode()));

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            LocalDate mainStartDate = LocalDate.parse(missionDetailsDTO.getStartDate(), DATE_FORMATTER);
            LocalDate mainEndDate = LocalDate.parse(missionDetailsDTO.getEndDate(), DATE_FORMATTER);

            if (!missionDetailsDTO.getMissionDestinations().isEmpty()) {
                MissionDestinationDTO firstDestination = missionDetailsDTO.getMissionDestinations().get(0);
                MissionDestinationDTO lastDestination = missionDetailsDTO.getMissionDestinations().get(missionDetailsDTO.getMissionDestinations().size() - 1);

                LocalDate firstDestinationStartDate = LocalDate.parse(firstDestination.getStartDate(), DATE_FORMATTER);
                LocalDate lastDestinationEndDate = LocalDate.parse(lastDestination.getEndDate(), DATE_FORMATTER);

                if (!mainStartDate.isEqual(firstDestinationStartDate)) {
                    errors.put("startDate", "The startDate of the mission must match the startDate of the first destination.");
                }

                if (!mainEndDate.isEqual(lastDestinationEndDate)) {
                    errors.put("endDate", "The endDate of the mission must match the endDate of the last destination.");
                }
            }

            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }


            PlacementDTO placementDTO = placementService.getStructureWithJobMasterAndGradeByEmployeeId(employee.get().getEmployeeId());

            int gradeId = placementDTO.getJobMaster().getGrade().getGradeId();

            if (gradeId == 1 || gradeId == 2 || gradeId == 3 || gradeId == 4) {
                if("PUBLIC_CAR".equalsIgnoreCase(missionDetailsDTO.getTransportMode())) {
                    ApiResponse errorResponse = new ApiResponse("For E3, E2, E1, M3 Staffs cannot use PUBLIC CAR", HttpStatus.BAD_REQUEST.value());
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }else {
                if("PRIVATE_CAR".equalsIgnoreCase(missionDetailsDTO.getTransportMode())) {
                    ApiResponse errorResponse = new ApiResponse("Except E3, E2, E1, M3 Staffs Others cannot use PRIVATE CAR", HttpStatus.BAD_REQUEST.value());
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            
             List<MissionAllowanceDistrictDTO> missionAllowances = new ArrayList<>();
             for (MissionDestinationDTO destinationDTO : missionDetailsDTO.getMissionDestinations()) {
                MissionAllowanceDistrictDTO missionDestination = new MissionAllowanceDistrictDTO();
                missionDestination.setDistrictId(Integer.parseInt(destinationDTO.getDistrictId()));
                missionDestination.setNumberOfDays(destinationDTO.getNumberOfDays());
                missionDestination.setNumberOfNights(destinationDTO.getNumberOfNights());

                missionAllowances.add(missionDestination);
            }

            String missionAllowanceJson = convertToJson(missionAllowances);
            Object result = missionAllowanceService.calculateAllowance(missionDetailsDTO.getEmployeeId(), missionAllowanceJson);

            
            missionDetails.setEmployee(employee.get());
            missionDetails.setApprover(approver.get());
            missionDetails.setProposer(proposer.get());

            // Convert startDate and endDate from String to LocalDate
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate startDate = LocalDate.parse(missionDetailsDTO.getStartDate(), formatter);
            LocalDate endDate = LocalDate.parse(missionDetailsDTO.getEndDate(), formatter);

            missionDetails.setStartDate(startDate);
            missionDetails.setEndDate(endDate);
            missionDetails.setPurposeOfMission(missionDetailsDTO.getPurposeOfMission());
            missionDetails.setExpectedResults(missionDetailsDTO.getExpectedResults());
            missionDetails.setMissionDays(missionDetailsDTO.getMissionDays());
            missionDetails.setMissionNights(missionDetailsDTO.getMissionNights());
            missionDetails.setTransportMode(TransportMode.valueOf(missionDetailsDTO.getTransportMode()));

            missionDetails.setPlace(missionDetailsDTO.getPlace());


            Grade grade = gradeService.getGradeById(gradeId).get();
            Optional<MissionAllowance> missionAllowance = missionAllowanceServiceRepo.getAllowanceByGrade(grade);

            for (MissionDestinationDTO destinationDTO : missionDetailsDTO.getMissionDestinations()) {
                MissionDestination missionDestination = new MissionDestination();
                
                Optional<MissionLocation> missionLocation = missionLocationService.getMissionLocationsByDistrictId(Integer.parseInt(destinationDTO.getDistrictId()));
                if(!missionLocation.isPresent()) {
                    ApiResponse errorResponse = new ApiResponse("District with "+Integer.parseInt(destinationDTO.getDistrictId())+" is not found", HttpStatus.BAD_REQUEST.value());
                    return ResponseEntity.badRequest().body(errorResponse);
                }

                String nightRate = getZoneByNumber(missionAllowance.get(), missionLocation.get().getZone());
                Optional<District> district = districtService.getDistrictByCode(Integer.parseInt(destinationDTO.getDistrictId()));
                missionDestination.setDistrict(district.get());
                missionDestination.setStartDate(LocalDate.parse(destinationDTO.getStartDate(), formatter));
                missionDestination.setEndDate(LocalDate.parse(destinationDTO.getEndDate(), formatter));
                missionDestination.setNumberOfDays(destinationDTO.getNumberOfDays());
                missionDestination.setNumberOfNights(destinationDTO.getNumberOfNights());
                missionDestination.setDayRate(missionAllowance.get().getDailyAllowance());
                missionDestination.setNightRate(nightRate);
                missionDetails.addMissionDestination(missionDestination);
            }

            MissionHistoryRecord historyRecord = new MissionHistoryRecord();
            historyRecord.setStatus(Status.SUBMITTED_FOR_APPROVAL);
            historyRecord.setPerformedBy(employee.get());
            historyRecord.setComment("Mission re-submitted for approval");

            missionDetails.addHistory(historyRecord);

            for (MultipartFile missionFile : missionFiles) {

                String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
                String newFileName = String.format("%s-%s-%s.pdf", missionDetailsDTO.getEmployeeId(), UUID.randomUUID().toString(), currentDate);
                MissionFile missionFileOb = new MissionFile();
                missionFileOb.setMissionFile(newFileName);
                missionFileOb.setMissionDocType(DocType.SUPPORT);
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

            // Handle other properties as needed
            missionDetails.setMissionAllowance(Double.parseDouble(result.toString()));
            missionDetails.setTotalAmount(Double.parseDouble(result.toString()));

            List<String> validTransportModes = Arrays.asList("PRIVATE_CAR");
            
            if (validTransportModes.contains(missionDetailsDTO.getTransportMode())) {
                missionDetails.setPlate(missionDetailsDTO.getPlate());
            } else {
                missionDetails.setPlate(null);
            }

            missionDetails.setCreatedAt(LocalDateTime.now());

            MissionDetails savedMissionDetails = missionDetailsService.saveMissionDetails(missionDetails);
            MissionSuccessResponse successResponse = new MissionSuccessResponse("Mission details resubmitted successfully", savedMissionDetails, HttpStatus.OK.value());
            
            emailService.sendMissionRequestEmail(missionDetails, employee.get(), approver.get());

            String employeeNames = employee.get().getGivenName() +" "+employee.get().getFamilyName();
            Notification notification = new Notification();
            notification.setEmployee(approver.get());
            notification.setTitle("Mission for approval requested");
            notification.setMessage("Mission request with referenceID "+referenceId+" for "+employeeNames+" is awaiting your approval.");
            notification.setReferenceId(referenceId);
            notification.setType(Status.SUBMITTED_FOR_APPROVAL);
            notification.setIsRead(false);
            notification.setDate(LocalDateTime.now());

            notificationService.saveNotification(notification);


            return new ResponseEntity<>(successResponse, HttpStatus.OK);

        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new MissionFetchError(e.getMessage(), 500));
        }
    }
}

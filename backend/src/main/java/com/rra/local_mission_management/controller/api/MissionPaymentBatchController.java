package com.rra.local_mission_management.controller.api;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rra.local_mission_management.dto.request.PaymentBatchRequest;
import com.rra.local_mission_management.dto.responce.ApiResponse;
import com.rra.local_mission_management.dto.responce.GetAllBatch;
import com.rra.local_mission_management.dto.responce.PaymentBatchResponse;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.entity.MissionDetails;
import com.rra.local_mission_management.entity.MissionPaymentBatch;
import com.rra.local_mission_management.entity.Notification;
import com.rra.local_mission_management.enums.BatchStatus;
import com.rra.local_mission_management.enums.Status;
import com.rra.local_mission_management.exception.UniqueConstraintViolationException;
import com.rra.local_mission_management.service.EmailService;
import com.rra.local_mission_management.service.EmployeeService;
import com.rra.local_mission_management.service.MissionDetailsService;
import com.rra.local_mission_management.service.MissionPaymentBatchServices;
import com.rra.local_mission_management.service.NotificationService;

@RestController
@RequestMapping("/api/v1/payment")
public class MissionPaymentBatchController {
    
    @Autowired
    MissionPaymentBatchServices missionPaymentBatchServices = new MissionPaymentBatchServices();

    @Autowired
    MissionDetailsService  missionDetailsService = new MissionDetailsService();

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmployeeService employeeService;



    
    @PostMapping
public ResponseEntity<?> createBatch(@RequestBody PaymentBatchRequest paymentBatchSaveRequest) {
    try {
        double totalAmount = 0;

        // Check if all mission IDs exist and if their status is MISSION_COMPUTED
        for (String missionId : paymentBatchSaveRequest.getMissionId()) {
            Optional<MissionDetails> optionalMission = missionDetailsService.getMissionDetailsByReferenceId(missionId);
            if (!optionalMission.isPresent()) {
                return new ResponseEntity<>(new ApiResponse("Mission ID " + missionId + " not found", HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
            }

            MissionDetails mission = optionalMission.get();

            // Check if the mission's status is MISSION_COMPUTED
            if (!mission.getStatus().equals(Status.MISSION_COMPUTED)) {
                return new ResponseEntity<>(new ApiResponse("Mission detail with ID " + missionId + " not computed yet", HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
            }

            // Check if the mission is already associated with a payment batch
            if (mission.getMissionPaymentBatch() != null) {
                return new ResponseEntity<>(new ApiResponse("Mission ID " + missionId + " is already included in a payment batch", HttpStatus.CONFLICT.value()), HttpStatus.CONFLICT);
            }

            // Add the mission's amount to the total amount
            totalAmount += mission.getTotalAmount();
        }

        // Create a new MissionPaymentBatch and set its properties
        MissionPaymentBatch missionPaymentBatch = new MissionPaymentBatch();
        missionPaymentBatch.setPaymentType(paymentBatchSaveRequest.getPaymentType());
        missionPaymentBatch.setIban(paymentBatchSaveRequest.getIban());
        missionPaymentBatch.setAmount(totalAmount); 
        missionPaymentBatch.setDescription(paymentBatchSaveRequest.getDescription());

        // Save the MissionPaymentBatch to the database
        MissionPaymentBatch savedBatch = missionPaymentBatchServices.saveMissionPaymentBatch(missionPaymentBatch);

        PaymentBatchResponse successResponse = new PaymentBatchResponse("Batch Created Successfully", savedBatch);

        // Link MissionDetails with the created MissionPaymentBatch and send emails/notifications
        for (String missionId : paymentBatchSaveRequest.getMissionId()) {
            Optional<MissionDetails> optionalMission = missionDetailsService.getMissionDetailsByReferenceId(missionId);
            if (optionalMission.isPresent()) {
                MissionDetails mission = optionalMission.get();
                mission.setMissionPaymentBatch(savedBatch);  // Set the foreign key
                mission.setStatus(Status.MISSION_PAYMENT_BATCH_CREATED);
                missionDetailsService.saveMissionDetails(mission);  // Update mission record

                // Assuming the mission has employee and approver information
                
            Optional<Employee> employee = employeeService.getEmployeeById(mission.getEmployee().getEmployeeId().toString());

                if (employee.isPresent()) {
                    // Send email notification
                    emailService.sendBatchEmail(employee.get(), mission);

                    // Create and save notification
                    // String employeeNames = employee.get().getGivenName() + " " + employee.get().getFamilyName();
                    Notification notification = new Notification();
                    notification.setEmployee(employee.get());
                    notification.setTitle("Your Mission Has been added to PaymentBatch");
                    notification.setMessage("Your Mission with referenceID " + missionId + " Has been added to paymentBatch .");
                    notification.setReferenceId(missionId);
                    notification.setType(Status.MISSION_PAYMENT_BATCH_CREATED);
                    notification.setIsRead(false);
                    notification.setDate(LocalDateTime.now());

                    // Save notification to the database
                    notificationService.saveNotification(notification);
                }
            }
        }

        // Return a success response
        return new ResponseEntity<>(successResponse, HttpStatus.CREATED);

    } catch (UniqueConstraintViolationException ex) {
        ex.printStackTrace();
        return new ResponseEntity<>(new ApiResponse(ex.getMessage(), HttpStatus.CONFLICT.value()), HttpStatus.CONFLICT);
    } catch (Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>(new ApiResponse("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR.value()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    
    

        @GetMapping("/Batches")
        public ResponseEntity<?> PaymentBatchService(){
        try{
            List<MissionPaymentBatch> missionPaymentBatch = missionPaymentBatchServices.getAllMissionPaymentBatches();
           GetAllBatch successResponse = new GetAllBatch("Retrieved Successfully", missionPaymentBatch);
           return new ResponseEntity<>(successResponse, HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new ApiResponse("An error occurred while processing the request", 500));
        }
    }
    

      

        @GetMapping("/searchBatchDetails/{sn}")
        public ResponseEntity<?> getMissionPaymentBatchBySn(@PathVariable("sn") String sn) {
            try{
                MissionPaymentBatch missionPaymentBatch = missionPaymentBatchServices.getMissionPaymentBatchBySn(sn);
                if (missionPaymentBatch == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(new ApiResponse("No Payment Batch Found for SN: " + sn, 404));
                }
                PaymentBatchResponse successResponse = new  PaymentBatchResponse("Retrieved Successfully", missionPaymentBatch);
                return new ResponseEntity<>(successResponse, HttpStatus.OK);
            }catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body(new ApiResponse("An error occurred while processing the request", 500));
            }
        }


        @PutMapping("/cancel/{sn}")
public ResponseEntity<?> cancelPaymentBatch(@PathVariable String sn) {
    try {
        // Fetch the payment batch by its serial number (SN)
        MissionPaymentBatch missionPaymentBatch = missionPaymentBatchServices.getMissionPaymentBatchBySn(sn);

        if (missionPaymentBatch == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse("No Payment Batch Found for SN: " + sn, 404));
        }

        // Check if the batch is already cancelled
        if (missionPaymentBatch.getStatus() == null ? BatchStatus.CANCELLED.getStatus() == null : missionPaymentBatch.getStatus().equals(BatchStatus.CANCELLED.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(new ApiResponse("The payment batch is already cancelled.", 400));
        }

        // Fetch all MissionDetails associated with this payment batch
        List<MissionDetails> missionDetailsList = missionDetailsService.getMissionsByPaymentBatch(missionPaymentBatch);

        // Update each associated MissionDetails status back to MISSION_COMPUTED and set the foreign key to null
        for (MissionDetails missionDetails : missionDetailsList) {
            missionDetails.setStatus(Status.MISSION_COMPUTED); // Revert status
            missionDetails.setMissionPaymentBatch(null); // Remove foreign key reference
            missionDetailsService.saveMissionDetails(missionDetails); // Save updated mission
        }

        // Proceed with the cancellation of the payment batch
        MissionPaymentBatch updatedBatch = missionPaymentBatchServices.cancelPaymentBatch(sn);

        PaymentBatchResponse successResponse = new PaymentBatchResponse("Batch Cancelled Successfully", updatedBatch);
        return new ResponseEntity<>(successResponse, HttpStatus.OK);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body(new ApiResponse("An error occurred while processing the request", 500));
    }
}

}

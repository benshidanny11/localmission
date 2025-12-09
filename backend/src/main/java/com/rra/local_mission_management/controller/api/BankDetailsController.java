package com.rra.local_mission_management.controller.api;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rra.local_mission_management.dto.request.BankDetailsRequest;
import com.rra.local_mission_management.dto.request.BankDetailsSaveRequest;
import com.rra.local_mission_management.dto.responce.ApiResponse;
import com.rra.local_mission_management.dto.responce.BankDetailsSuccess;
import com.rra.local_mission_management.dto.responce.SearchSuccessResponse;
import com.rra.local_mission_management.entity.BankDetails;
import com.rra.local_mission_management.entity.Employee;
import com.rra.local_mission_management.exception.UniqueConstraintViolationException;
import com.rra.local_mission_management.service.BankDetailsServices;
import com.rra.local_mission_management.service.EmployeeService;





@RestController
@RequestMapping("/api/v1/BankDetails")
public class BankDetailsController {

    @Autowired
    private BankDetailsServices bankDetailsServices;
    

    @Autowired
    private EmployeeService employeeService;



    @GetMapping("")
     public ResponseEntity<?> bankDetailsServices() {
        List<BankDetails> bakDetails =  bankDetailsServices.getAllBankDetails();
        if (bakDetails.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse("No Bank Information found", 404));
        }
        return ResponseEntity.ok(bakDetails);
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchBankDetails(@RequestParam Long searchTerm) {
        Optional<BankDetails> bakDetails = bankDetailsServices.getBankDetailById(searchTerm);
        if (bakDetails.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse("No Bank Detail found for the given ID", 404));
        }
        return ResponseEntity.ok(bakDetails);
    }

    @GetMapping("/searchemp")
    public ResponseEntity<?> searchEmployeebyId(@RequestParam String searchTerm) {
        Optional<BankDetails> empbyId = bankDetailsServices.getempById(searchTerm);
        if (empbyId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiResponse("No Bank Detail found for the given Employee Id", 404));
        }
        
        
        // Return success response with message
        return ResponseEntity.ok(new SearchSuccessResponse<>(empbyId.get()));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBankDetails(@PathVariable String id, @RequestBody BankDetailsRequest bankDetailsRequest) {
        // Fetch existing BankDetails by ID
        Optional<BankDetails> existingBankDetails = bankDetailsServices.getempById(id);
        
        if (!existingBankDetails.isPresent()) {
            return new ResponseEntity<>(new ApiResponse("Bank details were not found", HttpStatus.NOT_FOUND.value()), HttpStatus.NOT_FOUND);
        }
    
        // Validate fields
        if (!StringUtils.hasText(bankDetailsRequest.getBankCode())) {
            return new ResponseEntity<>(new ApiResponse("Bank code cannot be empty", HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
        }
        if (!StringUtils.hasText(bankDetailsRequest.getBankAccount())) {
            return new ResponseEntity<>(new ApiResponse("Bank account cannot be empty", HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
        }
        if (!StringUtils.hasText(bankDetailsRequest.getBankName())) {
            return new ResponseEntity<>(new ApiResponse("Bank name cannot be empty", HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
        }
    
    
        // Update the BankDetails entity
        BankDetails bankDetailsToUpdate = existingBankDetails.get();
        bankDetailsToUpdate.setBankCode(bankDetailsRequest.getBankCode());
        bankDetailsToUpdate.setBankAccount(bankDetailsRequest.getBankAccount());
        bankDetailsToUpdate.setBankName(bankDetailsRequest.getBankName());
    
        // Save the updated BankDetails to the database
        BankDetails updatedBankDetails = bankDetailsServices.saveBankDetail(bankDetailsToUpdate);
    
        BankDetailsSuccess successResponse = new BankDetailsSuccess("Bank Details updated Successfully", updatedBankDetails);
        // Respond with success
        return new ResponseEntity<>(successResponse, HttpStatus.OK);
    }
    

    @PostMapping
     public ResponseEntity<?> createDetails(@RequestBody BankDetailsSaveRequest bankDetailsSaveRequest) {
        try {
            // Validate fields (same as before)

            // Check if employee exists
            Optional<Employee> employee = employeeService.getEmployeeById(bankDetailsSaveRequest.getEmployeeId());
            if (!employee.isPresent()) {
                return new ResponseEntity<>(new ApiResponse("Employee not found", HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
            }

            // Create and save bank details
            BankDetails bankDetails = new BankDetails();
            bankDetails.setBankAccount(bankDetailsSaveRequest.getBankAccount());
            bankDetails.setBankCode(bankDetailsSaveRequest.getBankCode());
            bankDetails.setBankName(bankDetailsSaveRequest.getBankName());
            bankDetails.setEmployee(employee.get());

            BankDetails savedBankDetails = bankDetailsServices.saveBankDetail(bankDetails);

            BankDetailsSuccess successResponse = new BankDetailsSuccess("Bank Details Saved Successfully", savedBankDetails);
            return new ResponseEntity<>(successResponse, HttpStatus.CREATED);

        } catch (UniqueConstraintViolationException ex) {
            return new ResponseEntity<>(new ApiResponse(ex.getMessage(), HttpStatus.CONFLICT.value()), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR.value()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
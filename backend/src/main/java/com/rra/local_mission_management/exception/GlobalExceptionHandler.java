package com.rra.local_mission_management.exception;

import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.HashMap;
import java.util.Map;

import com.rra.local_mission_management.dto.responce.ApiResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ApiResponse> handleMissingServletRequestPartException(MissingServletRequestPartException ex) {
        ApiResponse errorResponse = new ApiResponse("Required part '" + ex.getRequestPartName() + "' is not present.", HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse> handleMissingParams(MissingServletRequestParameterException ex) {
        String name = ex.getParameterName();
        String message = String.format("Required parameter '%s' is missing", name);
        ApiResponse errorResponse = new ApiResponse(message, HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Handle method argument validation exceptions
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        String combinedErrors = errors.values().stream().reduce("", (subtotal, element) -> subtotal + element + "; ");
        ApiResponse errorResponse = new ApiResponse(combinedErrors.trim(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Handle type mismatches (e.g., incorrect data types in request parameters)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = String.format("Parameter '%s' should be of type '%s'", ex.getName(), ex.getRequiredType().getSimpleName());
        ApiResponse errorResponse = new ApiResponse(message, HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Handle binding exceptions
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse> handleBindException(BindException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        String combinedErrors = errors.values().stream().reduce("", (subtotal, element) -> subtotal + element + "; ");
        ApiResponse errorResponse = new ApiResponse(combinedErrors.trim(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Handle requests to non-existent endpoints
    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponse> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        String message = "The requested endpoint was not found.";
        ApiResponse errorResponse = new ApiResponse(message, HttpStatus.NOT_FOUND.value());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // Handle generic exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleAllUncaughtException(Exception ex) {
        String message = "An unexpected error occurred.";
        ApiResponse errorResponse = new ApiResponse(message, HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

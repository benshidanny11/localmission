package com.rra.local_mission_management.exception;

public class UniqueConstraintViolationException extends RuntimeException {
    public UniqueConstraintViolationException(String message) {
        super(message);
    }
}

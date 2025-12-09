package com.rra.local_mission_management.dto.responce;

import lombok.Data;

@Data
public class ResponseDto<T> {
    private String message;
    private T data;
}

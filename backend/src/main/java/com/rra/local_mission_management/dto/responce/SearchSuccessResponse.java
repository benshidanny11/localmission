package com.rra.local_mission_management.dto.responce;

import lombok.Data;

@Data
public class SearchSuccessResponse<T> {
    private String message;
    private T data;

    public SearchSuccessResponse(T data) {
        this.message = "Search completed successfully";
        this.data = data;
    }
    
}

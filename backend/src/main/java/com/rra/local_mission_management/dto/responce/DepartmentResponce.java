package com.rra.local_mission_management.dto.responce;

import lombok.Data;

@Data
public class DepartmentResponce {
    private int id;
    private String name;

    public DepartmentResponce(int id, String name) {
        this.id = id;
        this.name = name;
    }
}

package com.rra.local_mission_management.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.rra.local_mission_management.entity.Employee;

import java.io.IOException;

public class EmployeeSerializer extends StdSerializer<Employee> {

    public EmployeeSerializer() {
        this(null);
    }

    public EmployeeSerializer(Class<Employee> t) {
        super(t);
    }

    @Override
    public void serialize(Employee employee, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("employeeId", employee.getEmployeeId());
        jsonGenerator.writeStringField("givenName", employee.getGivenName());
        jsonGenerator.writeStringField("familyName", employee.getFamilyName());
        jsonGenerator.writeStringField("phoneNumber", employee.getPhoneNumber());
        jsonGenerator.writeStringField("workEmail", employee.getWorkEmail());
        jsonGenerator.writeStringField("personalEmail", employee.getPersonalEmail());
        if (employee.getPlacement() != null) {
            jsonGenerator.writeStringField("jobtitle", employee.getPlacement().getJobMaster().getJobTitle());
            jsonGenerator.writeNumberField("grade", employee.getPlacement().getJobMaster().getGrade().getGradeId());
            jsonGenerator.writeStringField("gradeName", employee.getPlacement().getJobMaster().getGrade().getShortName());
            jsonGenerator.writeStringField("department", employee.getPlacement().getStructure().getStructureName());
        } else {
            jsonGenerator.writeNullField("jobTitle");
            jsonGenerator.writeNullField("grade");
            jsonGenerator.writeNullField("gradeName");
            jsonGenerator.writeNullField("department");
        }

        jsonGenerator.writeEndObject();
    }
}

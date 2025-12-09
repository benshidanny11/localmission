package com.rra.local_mission_management.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.rra.local_mission_management.entity.Employee;

import java.io.IOException;

public class EmployeeIdSerializer extends StdSerializer<Employee> {

    public EmployeeIdSerializer() {
        this(null);
    }

    public EmployeeIdSerializer(Class<Employee> t) {
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
        jsonGenerator.writeEndObject();
    }
}

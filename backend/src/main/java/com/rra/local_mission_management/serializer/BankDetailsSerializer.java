package com.rra.local_mission_management.serializer;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.rra.local_mission_management.entity.BankDetails;

public class BankDetailsSerializer extends JsonSerializer<BankDetails>{

    @Override
    public void serialize(BankDetails bankDetails, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("bankId", bankDetails.getBankId().toString());
        jsonGenerator.writeStringField("bankCode", bankDetails.getBankCode());
        jsonGenerator.writeStringField("bankAccount", bankDetails.getBankAccount());
        jsonGenerator.writeStringField("bankName", bankDetails.getBankName());
        jsonGenerator.writeStringField("employeeId", bankDetails.getEmployee().getEmployeeId());
        jsonGenerator.writeEndObject();
    }
    
}

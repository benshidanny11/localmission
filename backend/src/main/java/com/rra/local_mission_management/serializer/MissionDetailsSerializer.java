package com.rra.local_mission_management.serializer;

import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.rra.local_mission_management.entity.BankDetails;
import com.rra.local_mission_management.entity.MissionDetails;

public class MissionDetailsSerializer extends JsonSerializer<List<MissionDetails>> {

    @Override
    public void serialize(List<MissionDetails> missionDetailsList, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartArray();
        for (MissionDetails missionDetails : missionDetailsList) {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeStringField("employeeId", missionDetails.getEmployee().getEmployeeId());
            jsonGenerator.writeStringField("givenName", missionDetails.getEmployee().getGivenName());
            jsonGenerator.writeStringField("familyName", missionDetails.getEmployee().getFamilyName());
            
            BankDetails bankDetails = missionDetails.getEmployee().getBankDetails();
            if (bankDetails != null) {
                jsonGenerator.writeStringField("bankAccount", missionDetails.getEmployee().getBankDetails().getBankAccount());
                jsonGenerator.writeStringField("bankName", missionDetails.getEmployee().getBankDetails().getBankName());
                jsonGenerator.writeStringField("bankCode", missionDetails.getEmployee().getBankDetails().getBankCode());
            } else {
                jsonGenerator.writeNullField("bankAccount");
            }
            
            jsonGenerator.writeStringField("amount", String.valueOf(missionDetails.getTotalAmount()));
            jsonGenerator.writeEndObject();
            
        }
        jsonGenerator.writeEndArray();
    }
}

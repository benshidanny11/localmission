package com.rra.local_mission_management.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.rra.local_mission_management.entity.District;

import java.io.IOException;

public class DistrictSerializer extends StdSerializer<District> {

    public DistrictSerializer() {
        this(null);
    }

    public DistrictSerializer(Class<District> t) {
        super(t);
    }

    @Override
    public void serialize(District district, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("districtCode", district.getDistrictCode());
        jsonGenerator.writeStringField("districtName", district.getDistrictName());
        jsonGenerator.writeEndObject();
    }
}

package com.rra.local_mission_management.utils;

import javax.mail.util.ByteArrayDataSource;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class EmailUtil {

    public static ByteArrayDataSource createByteArrayDataSource(InputStream is, String type) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[1024];
        int bytesRead;

        while ((bytesRead = is.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, bytesRead);
        }

        buffer.flush();
        return new ByteArrayDataSource(buffer.toByteArray(), type);
    }
}

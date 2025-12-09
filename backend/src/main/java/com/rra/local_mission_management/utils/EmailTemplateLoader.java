package com.rra.local_mission_management.utils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;

public class EmailTemplateLoader {

    public String loadTemplate(String templatePath, Map<String, String> placeholders) throws IOException {
        // Load the template from the classpath
        ClassPathResource resource = new ClassPathResource(templatePath);

        // Read the content of the template
        try (InputStream inputStream = resource.getInputStream()) {
            String content = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

            // Replace placeholders with actual values
            for (Map.Entry<String, String> entry : placeholders.entrySet()) {
                content = content.replace("{" + entry.getKey() + "}", entry.getValue());
            }

            return content;
        }
    }
}

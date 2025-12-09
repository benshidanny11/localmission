package com.rra.local_mission_management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*"); // Allows all origins. You can replace this with a specific domain
        config.addAllowedHeader("*");
        config.addAllowedMethod("*"); // Allows all methods (GET, POST, PUT, DELETE, etc.)
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}

package com.rra.local_mission_management.config;

import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;

import com.rra.local_mission_management.jwt.AuthTokenFilter;
import com.rra.local_mission_management.service.CustomUserDetailsService;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import static org.springframework.security.config.Customizer.withDefaults;


import java.security.MessageDigest;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsServiceImp;
    private final AuthTokenFilter jwtAuthenticationFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsServiceImp,
                          AuthTokenFilter jwtAuthenticationFilter) {
        this.userDetailsServiceImp = userDetailsServiceImp;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/api/v1/auth/**", "/files/**", "/images/**", "/favicon.ico", "/static/**", "/ws/**", "/api/v1/password/**")
                        .permitAll() // Allow access to these paths without authentication
                        .anyRequest().authenticated()
                )
                .userDetailsService(userDetailsServiceImp)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(e -> e
                    .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                    .accessDeniedHandler((request, response, accessDeniedException) -> response.setStatus(403))
                    .defaultAuthenticationEntryPointFor(
                        new HttpStatusEntryPoint(HttpStatus.NOT_FOUND),
                        new AntPathRequestMatcher("/**")
                    )
                )
                .logout(l -> l
                        .logoutUrl("/logout")
                        .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
                )
                .build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                try {
                    MessageDigest md = MessageDigest.getInstance("SHA-1");
                    byte[] result = md.digest(rawPassword.toString().getBytes());
                    StringBuilder sb = new StringBuilder();
                    for (byte b : result) {
                        sb.append(String.format("%02x", b));
                    }
                    return sb.toString();
                } catch (NoSuchAlgorithmException e) {
                    throw new RuntimeException(e);
                }
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return encode(rawPassword).equals(encodedPassword);
            }
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
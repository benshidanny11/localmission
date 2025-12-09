package com.rra.local_mission_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource("classpath:env.properties")
public class LocalMissionManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(LocalMissionManagementApplication.class, args);
	}

}

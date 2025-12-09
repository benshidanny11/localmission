package com.rra.local_mission_management.controller.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rra.local_mission_management.dto.responce.MissionErrorResponse;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/files")
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final ResourceLoader resourceLoader;

    public FileUploadController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected.");
        }

        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                System.out.println("Created directories at: " + path.toString());
            }

            Path filePath = path.resolve(file.getOriginalFilename());
            System.out.println("Saving file to: " + filePath.toString());
            Files.copy(file.getInputStream(), filePath);

            return ResponseEntity.ok("File uploaded successfully.");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload file. Error: " + e.getMessage());
        }
    }


    @GetMapping("/{filename}")
    public ResponseEntity<?> getFile(@PathVariable String filename) {
        try {
            // Load the file as a Resource
            Resource resource = resourceLoader.getResource("file:" + uploadDir + File.separator + filename);
            if (resource.exists()) {
                // Set the Content-Type header to match the file's type
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(Paths.get(uploadDir, filename)));
                
                return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
            } else {
                MissionErrorResponse errorResponse = new MissionErrorResponse("File not found", HttpStatus.BAD_REQUEST.value());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
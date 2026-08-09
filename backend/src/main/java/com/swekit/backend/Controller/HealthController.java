package com.swekit.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> rootCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "Backend is live and connected!"
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "Backend is live and connected!"
        ));
    }
}

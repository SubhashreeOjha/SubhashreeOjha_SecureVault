package com.securevault.controller;
import org.springframework.web.bind.annotation.*;import java.util.*;
@RestController @RequestMapping("/api/system") @CrossOrigin(origins="http://localhost:5173") public class HealthController{@GetMapping("/health")public Map<String,Object> health(){return Map.of("status","UP","service","SecureVault","security","JWT + AES-GCM","timestamp",java.time.Instant.now().toString());}}

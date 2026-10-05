package com.securevault.controller;
import org.springframework.web.bind.annotation.*;import java.util.*;
@RestController @RequestMapping("/api/oauth2") @CrossOrigin(origins="http://localhost:5173") public class OAuthController{@GetMapping("/status")public Map<String,Object> status(){return Map.of("enabled",Boolean.parseBoolean(System.getenv().getOrDefault("SECUREVAULT_OAUTH2_ENABLED","false")),"providers",List.of("Google","GitHub"));}}

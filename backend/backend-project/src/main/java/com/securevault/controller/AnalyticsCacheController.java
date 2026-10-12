package com.securevault.controller;
import com.securevault.service.AnalyticsCacheService;import org.springframework.web.bind.annotation.*;import java.util.*;
@RestController @RequestMapping("/api/security/cache") @CrossOrigin(origins="http://localhost:5173") public class AnalyticsCacheController{private final AnalyticsCacheService cache;public AnalyticsCacheController(AnalyticsCacheService c){cache=c;}@GetMapping("/status")public Map<String,Object> status(){return cache.stats();}}

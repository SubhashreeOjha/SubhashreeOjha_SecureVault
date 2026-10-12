package com.securevault.controller;
import com.securevault.entity.*;import com.securevault.repository.UserRepository;import com.securevault.service.*;import org.springframework.http.*;import org.springframework.security.core.Authentication;import org.springframework.web.bind.annotation.*;import java.time.*;import java.util.*;
@RestController @RequestMapping("/api/security") @CrossOrigin(origins="http://localhost:5173") public class SecurityController{
 private final UserRepository users;private final SecurityMonitoringService monitor;private final NotificationService notifications;private final SessionService sessions;private final DeviceService devices;
 public SecurityController(UserRepository u,SecurityMonitoringService m,NotificationService n,SessionService s,DeviceService d){users=u;monitor=m;notifications=n;sessions=s;devices=d;}
 private User user(Authentication a){return users.findByEmail(a.getName()).orElseThrow();}
 @GetMapping("/events") public List<SecurityEvent> events(Authentication a,@RequestParam(defaultValue="7d")String range){LocalDateTime end=LocalDateTime.now(),start=end.minusDays(range.equals("today")?1:range.equals("30d")?30:7);return monitor.events(user(a),start,end);}
 @GetMapping("/analytics") public Map<String,Object> analytics(Authentication a,@RequestParam(defaultValue="7d")String range){LocalDateTime end=LocalDateTime.now(),start=range.equals("today")?end.toLocalDate().atStartOfDay():end.minusDays(range.equals("30d")?30:7);return monitor.analytics(user(a),start,end);}
 @GetMapping("/devices") public List<Device> devices(Authentication a){return monitor.deviceList(user(a));}
 @GetMapping("/notifications") public Map<String,Object> notifications(Authentication a){User u=user(a);return Map.of("items",notifications.list(u),"unread",notifications.unread(u));}
 @PostMapping("/notifications/{id}/read") public ResponseEntity<?> read(@PathVariable Long id,Authentication a){notifications.markRead(id,user(a));return ResponseEntity.ok().build();}
}

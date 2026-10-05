package com.securevault.controller;

import com.securevault.entity.Credential;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;
import com.securevault.service.CredentialService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/password-health")
@CrossOrigin(origins = "http://localhost:5173")
public class PasswordHealthController {

    private final UserRepository users;
    private final CredentialService credentials;

    public PasswordHealthController(
            UserRepository users,
            CredentialService credentials) {
        this.users = users;
        this.credentials = credentials;
    }

    @GetMapping
    public Map<String, Object> health(Authentication authentication) {

        User user = users.findByEmail(authentication.getName())
                .orElseThrow();

        List<Credential> list =
                credentials.getUserCredentials(user);

        long weak = list.stream()
                .filter(c ->
                        c.getPassword() != null &&
                        c.getPassword().length() < 10)
                .count();

        long strong = list.size() - weak;

        // Detect reused passwords
        Map<String, Integer> passwordCount = new HashMap<>();

        for (Credential credential : list) {
            if (credential.getPassword() != null) {
                passwordCount.merge(
                        credential.getPassword(),
                        1,
                        Integer::sum
                );
            }
        }

        long reused = passwordCount.values()
                .stream()
                .filter(count -> count > 1)
                .mapToLong(count -> count)
                .sum();

        // Detect expired passwords
        LocalDateTime now = LocalDateTime.now();

        long expired = list.stream()
                .filter(c ->
                        c.getPasswordExpiresAt() != null &&
                        c.getPasswordExpiresAt().isBefore(now))
                .count();

        long healthPercent;

        if (list.isEmpty()) {
            healthPercent = 100;
        } else {

            double score =
                    (strong * 100.0) / list.size();

            // Reduce health score for reused passwords
            if (reused > 0) {
                score -= 15;
            }

            // Reduce health score for expired passwords
            if (expired > 0) {
                score -= 15;
            }

            healthPercent = Math.round(
                    Math.max(0, Math.min(100, score))
            );
        }

        Map<String, Object> response = new HashMap<>();

        response.put("total", list.size());
        response.put("strong", strong);
        response.put("weak", weak);
        response.put("reused", reused);
        response.put("expired", expired);
        response.put("healthPercent", healthPercent);

        return response;
    }
}
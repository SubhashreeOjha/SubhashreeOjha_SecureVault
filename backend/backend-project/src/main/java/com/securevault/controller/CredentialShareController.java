package com.securevault.controller;

import com.securevault.entity.Credential;
import com.securevault.entity.CredentialShare;
import com.securevault.entity.PermissionLevel;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;
import com.securevault.service.CredentialShareService;
import com.securevault.service.EncryptionService;
import com.securevault.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sharing")
@CrossOrigin(origins = "http://localhost:5173")
public class CredentialShareController {

    private final CredentialShareService shareService;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final NotificationService notificationService;

    public CredentialShareController(
            CredentialShareService shareService,
            UserRepository userRepository,
            EncryptionService encryptionService,
            NotificationService notificationService) {

        this.shareService = shareService;
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.notificationService = notificationService;
    }

    // =====================================================
    // SHARE CREDENTIAL
    // =====================================================

    @PostMapping("/share")
    public ResponseEntity<?> shareCredential(
            @RequestParam Long credentialId,
            @RequestParam String sharedUserEmail,
            @RequestParam PermissionLevel permissionLevel,
            @RequestParam(required = false)
            String expiresAt,
            Authentication authentication) {

        User owner =
                userRepository.findByEmail(authentication.getName())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        try {

            LocalDateTime expiration = null;

            if (expiresAt != null &&
                    !expiresAt.isBlank()) {

                expiration =
                        LocalDateTime.parse(expiresAt);
            }

            CredentialShare share =
                    shareService.shareCredential(
                            credentialId,
                            sharedUserEmail,
                            permissionLevel,
                            expiration,
                            owner
                    );

            notificationService.create(share.getSharedUser(), "SHARING", "Credential shared with you", "A credential was shared with you with " + permissionLevel.name() + " access.");
            return ResponseEntity.ok(
                    createShareResponse(share)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // SHARED WITH ME
    // =====================================================
@GetMapping("/my-shares")
public ResponseEntity<?> getMyShares(
        Authentication authentication) {

    User owner =
            userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found"
                            ));

    try {

        List<CredentialShare> shares =
                shareService.getMyShares(owner);

        return ResponseEntity.ok(
                shares.stream()
                        .map(this::createShareResponse)
                        .toList()
        );

    } catch (RuntimeException e) {

        return ResponseEntity.badRequest()
                .body(e.getMessage());
    }
}
    @GetMapping("/shared-with-me")
    public ResponseEntity<?> getSharedWithMe(
            Authentication authentication) {

        User sharedUser =
                userRepository.findByEmail(authentication.getName())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        try {

            List<CredentialShare> shares =
                    shareService.getSharedWithMe(sharedUser);

            return ResponseEntity.ok(
                    shares.stream()
                            .map(this::createShareResponse)
                            .toList()
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // VIEW SHARED CREDENTIAL
    // =====================================================

    @GetMapping("/shared/{shareId}")
    public ResponseEntity<?> getSharedCredential(
            @PathVariable Long shareId,
            Authentication authentication) {

        User sharedUser =
                userRepository.findByEmail(authentication.getName())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        try {

            CredentialShare share =
                    shareService.getShareForUser(
                            shareId,
                            sharedUser
                    );

            shareService.verifyViewAccess(
                    share,
                    sharedUser
            );

            Credential credential =
                    share.getCredential();

            String encryptedPassword =
                    credential.getPassword();

            String plainPassword =
                    encryptedPassword.startsWith("GCM:")
                            ? encryptionService.decrypt(
                                    encryptedPassword
                            )
                            : encryptedPassword;

            return ResponseEntity.ok(
                    createCredentialResponse(
                            credential,
                            plainPassword
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(403)
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // REMOVE SHARING
    // =====================================================
@PutMapping("/shared/{shareId}")
public ResponseEntity<?> updateSharedCredential(
        @PathVariable Long shareId,
        @jakarta.validation.Valid @RequestBody Credential credential,
        Authentication authentication) {

    User user =
            userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found"
                            ));

    try {

        Credential updatedCredential =
                shareService.updateSharedCredential(
                        shareId,
                        credential,
                        user
                );

        return ResponseEntity.ok(updatedCredential);

    } catch (RuntimeException e) {

        return ResponseEntity.status(403)
                .body(e.getMessage());
    }
}
@DeleteMapping("/shared/{shareId}")
public ResponseEntity<?> deleteSharedCredential(
        @PathVariable Long shareId,
        Authentication authentication) {

    User user =
            userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found"
                            ));

    try {

        shareService.deleteSharedCredential(
                shareId,
                user
        );

        return ResponseEntity.ok(
                "Shared credential deleted successfully"
        );

    } catch (RuntimeException e) {

        return ResponseEntity.status(403)
                .body(e.getMessage());
    }
}
    @DeleteMapping("/share/{shareId}")
    public ResponseEntity<?> removeShare(
            @PathVariable Long shareId,
            Authentication authentication) {

        User owner =
                userRepository.findByEmail(authentication.getName())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        try {

            shareService.removeShare(
                    shareId,
                    owner
            );

            return ResponseEntity.ok(
                    "Credential sharing removed successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // RESPONSE HELPERS
    // =====================================================

    private CredentialShareResponse createShareResponse(
            CredentialShare share) {

        CredentialShareResponse response =
                new CredentialShareResponse();

        response.setId(share.getId());
        response.setCredentialId(
                share.getCredential().getId()
        );
        response.setCredentialTitle(
                share.getCredential().getTitle()
        );
        response.setOwnerEmail(
                share.getOwner().getEmail()
        );
        response.setSharedUserEmail(
                share.getSharedUser().getEmail()
        );
        response.setPermissionLevel(
                share.getPermissionLevel()
        );
        response.setActive(
                share.isActive()
        );
        response.setExpiresAt(
                share.getExpiresAt()
        );

        return response;
    }

    private CredentialResponse createCredentialResponse(
            Credential credential,
            String plainPassword) {

        CredentialResponse response =
                new CredentialResponse();

        response.setId(credential.getId());
        response.setTitle(credential.getTitle());
        response.setUsername(credential.getUsername());
        response.setPassword(plainPassword);
        response.setUrl(credential.getUrl());
        response.setNotes(credential.getNotes());

        return response;
    }

    // =====================================================
    // DTO CLASSES
    // =====================================================

    public static class CredentialShareResponse {

        private Long id;
        private Long credentialId;
        private String credentialTitle;
        private String ownerEmail;
        private String sharedUserEmail;
        private PermissionLevel permissionLevel;
        private boolean active;
        private LocalDateTime expiresAt;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getCredentialId() {
            return credentialId;
        }

        public void setCredentialId(Long credentialId) {
            this.credentialId = credentialId;
        }

        public String getCredentialTitle() {
            return credentialTitle;
        }

        public void setCredentialTitle(String credentialTitle) {
            this.credentialTitle = credentialTitle;
        }

        public String getOwnerEmail() {
            return ownerEmail;
        }

        public void setOwnerEmail(String ownerEmail) {
            this.ownerEmail = ownerEmail;
        }

        public String getSharedUserEmail() {
            return sharedUserEmail;
        }

        public void setSharedUserEmail(String sharedUserEmail) {
            this.sharedUserEmail = sharedUserEmail;
        }

        public PermissionLevel getPermissionLevel() {
            return permissionLevel;
        }

        public void setPermissionLevel(
                PermissionLevel permissionLevel) {

            this.permissionLevel = permissionLevel;
        }

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }

        public LocalDateTime getExpiresAt() {
            return expiresAt;
        }

        public void setExpiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
        }
    }

    public static class CredentialResponse {

        private Long id;
        private String title;
        private String username;
        private String password;
        private String url;
        private String notes;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}

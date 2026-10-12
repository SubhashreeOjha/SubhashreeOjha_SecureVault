package com.securevault.service;

import org.springframework.transaction.annotation.Transactional;

import com.securevault.entity.Credential;
import com.securevault.entity.CredentialShare;
import com.securevault.entity.PermissionLevel;
import com.securevault.entity.User;
import com.securevault.repository.CredentialRepository;
import com.securevault.repository.CredentialShareRepository;
import com.securevault.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CredentialShareService {

    private final CredentialShareRepository shareRepository;
    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;

    public CredentialShareService(
            CredentialShareRepository shareRepository,
            UserRepository userRepository,
            CredentialRepository credentialRepository,
            EncryptionService encryptionService) {

        this.shareRepository = shareRepository;
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.encryptionService = encryptionService;
    }

    @Transactional
    public CredentialShare shareCredential(
            Long credentialId,
            String sharedUserEmail,
            PermissionLevel permissionLevel,
            LocalDateTime expiresAt,
            User owner) {

        Credential credential =
                credentialRepository.findById(credentialId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                ));

        // Only the credential owner can share it
        if (!credential.getUser().getId()
                .equals(owner.getId())) {

            throw new RuntimeException(
                    "Only the credential owner can share it"
            );
        }

        User sharedUser =
                userRepository.findByEmail(sharedUserEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Shared user not found"
                                ));

        // Prevent sharing a credential with yourself
        if (sharedUser.getId().equals(owner.getId())) {

            throw new RuntimeException(
                    "You cannot share a credential with yourself"
            );
        }

        // Validate expiration
        if (expiresAt != null &&
                !expiresAt.isAfter(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Expiration date must be in the future"
            );
        }

        /*
         * If this credential is already shared with the user,
         * update the existing share instead of creating a duplicate.
         */
        var existingShareOptional =
                shareRepository.findByCredentialAndSharedUser(
                        credential,
                        sharedUser
                );

        if (existingShareOptional.isPresent()) {

            CredentialShare existingShare =
                    existingShareOptional.get();

            existingShare.setOwner(owner);
            existingShare.setPermissionLevel(permissionLevel);
            existingShare.setExpiresAt(expiresAt);
            existingShare.setActive(true);

            return shareRepository.save(existingShare);
        }

        // Create a new share
        CredentialShare share =
                new CredentialShare();

        share.setCredential(credential);
        share.setOwner(owner);
        share.setSharedUser(sharedUser);
        share.setPermissionLevel(permissionLevel);
        share.setActive(true);
        share.setExpiresAt(expiresAt);

        return shareRepository.save(share);
    }

    public List<CredentialShare> getMyShares(
            User owner) {

        List<CredentialShare> shares =
                shareRepository.findByOwner(owner);

        for (CredentialShare share : shares) {

            if (isExpired(share)) {
                share.setActive(false);
                shareRepository.save(share);
            }
        }

        return shares;
    }

    public List<CredentialShare> getSharedWithMe(
            User sharedUser) {

        List<CredentialShare> shares =
                shareRepository.findBySharedUser(sharedUser);

        // Automatically deactivate expired shares
        for (CredentialShare share : shares) {

            if (isExpired(share)) {
                share.setActive(false);
                shareRepository.save(share);
            }
        }

        return shares;
    }

    public CredentialShare getShareForUser(
            Long shareId,
            User sharedUser) {

        CredentialShare share =
                shareRepository.findById(shareId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Share not found"
                                ));

        verifyActiveAccess(share, sharedUser);

        return share;
    }

    public void removeShare(
            Long shareId,
            User owner) {

        CredentialShare share =
                shareRepository.findById(shareId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Share not found"
                                ));

        // Only the owner can remove sharing
        if (!share.getOwner().getId()
                .equals(owner.getId())) {

            throw new RuntimeException(
                    "Only the credential owner can remove sharing"
            );
        }

        share.setActive(false);

        shareRepository.save(share);
    }

    public void verifyViewAccess(
            CredentialShare share,
            User user) {

        verifyActiveAccess(share, user);
    }

    public void verifyEditAccess(
            CredentialShare share,
            User user) {

        verifyActiveAccess(share, user);

        PermissionLevel permission =
                share.getPermissionLevel();

        if (permission != PermissionLevel.EDIT &&
                permission != PermissionLevel.FULL_MANAGEMENT) {

            throw new RuntimeException(
                    "You do not have permission to edit this credential"
            );
        }
    }

    public void verifyManagementAccess(
            CredentialShare share,
            User user) {

        verifyActiveAccess(share, user);

        if (share.getPermissionLevel()
                != PermissionLevel.FULL_MANAGEMENT) {

            throw new RuntimeException(
                    "You do not have full management permission"
            );
        }
    }

    public Credential updateSharedCredential(
            Long shareId,
            Credential updatedCredential,
            User user) {

        CredentialShare share =
                getShareForUser(shareId, user);

        verifyEditAccess(share, user);

        Credential credential =
                share.getCredential();

        credential.setTitle(
                updatedCredential.getTitle()
        );

        credential.setUsername(
                updatedCredential.getUsername()
        );

        String plainPassword =
                updatedCredential.getPassword();

        credential.setPassword(
                encryptionService.encrypt(plainPassword)
        );

        credential.setUrl(
                updatedCredential.getUrl()
        );

        credential.setNotes(
                updatedCredential.getNotes()
        );

        Credential savedCredential =
                credentialRepository.save(credential);

        Credential response =
                new Credential();

        response.setId(savedCredential.getId());
        response.setTitle(savedCredential.getTitle());
        response.setUsername(savedCredential.getUsername());
        response.setPassword(plainPassword);
        response.setUrl(savedCredential.getUrl());
        response.setNotes(savedCredential.getNotes());

        return response;
    }

    @Transactional
    public void deleteSharedCredential(
            Long shareId,
            User user) {

        CredentialShare share =
                getShareForUser(shareId, user);

        verifyManagementAccess(share, user);

        Credential credential =
                share.getCredential();

        shareRepository.delete(share);

        shareRepository.flush();

        credentialRepository.delete(credential);
    }

    private void verifyActiveAccess(
            CredentialShare share,
            User user) {

        if (!share.isActive()) {

            throw new RuntimeException(
                    "Access to this credential has been removed"
            );
        }

        if (!share.getSharedUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not authorized to access this credential"
            );
        }

        if (isExpired(share)) {

            share.setActive(false);
            shareRepository.save(share);

            throw new RuntimeException(
                    "Access to this credential has expired"
            );
        }
    }

    private boolean isExpired(
            CredentialShare share) {

        return share.getExpiresAt() != null &&
                !share.getExpiresAt()
                        .isAfter(LocalDateTime.now());
    }
}
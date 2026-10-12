package com.securevault.repository;

import com.securevault.entity.Credential;
import com.securevault.entity.CredentialShare;
import com.securevault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CredentialShareRepository
        extends JpaRepository<CredentialShare, Long> {

    List<CredentialShare> findBySharedUser(User sharedUser);

    List<CredentialShare> findByOwner(User owner);

    Optional<CredentialShare> findByCredentialAndSharedUser(
            Credential credential,
            User sharedUser
    );

    List<CredentialShare> findByCredential(
            Credential credential
    );
}
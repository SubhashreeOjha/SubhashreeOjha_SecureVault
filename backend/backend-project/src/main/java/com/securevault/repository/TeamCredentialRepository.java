package com.securevault.repository;

import com.securevault.entity.Team;
import com.securevault.entity.TeamCredential;
import com.securevault.entity.Credential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamCredentialRepository
        extends JpaRepository<TeamCredential, Long> {

    List<TeamCredential> findByTeam(Team team);

    Optional<TeamCredential> findByTeamAndCredential(
            Team team,
            Credential credential
    );
}
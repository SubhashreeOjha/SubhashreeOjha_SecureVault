package com.securevault.service;
import com.securevault.entity.CredentialShare;
import com.securevault.entity.Credential;
import com.securevault.entity.PermissionLevel;
import com.securevault.entity.Team;
import com.securevault.entity.TeamCredential;
import com.securevault.entity.TeamMember;
import com.securevault.entity.User;
import com.securevault.repository.CredentialRepository;
import com.securevault.repository.TeamCredentialRepository;
import com.securevault.repository.TeamMemberRepository;
import com.securevault.repository.TeamRepository;
import com.securevault.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamCredentialRepository teamCredentialRepository;
    private final UserRepository userRepository;
    private final CredentialRepository credentialRepository;
    private final EncryptionService encryptionService;

   public TeamService(
        TeamRepository teamRepository,
        TeamMemberRepository teamMemberRepository,
        TeamCredentialRepository teamCredentialRepository,
        UserRepository userRepository,
        CredentialRepository credentialRepository,
        EncryptionService encryptionService) {

        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.teamCredentialRepository = teamCredentialRepository;
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.encryptionService = encryptionService;
    }

    public Team createTeam(
            String teamName,
            User owner) {

        if (teamName == null ||
                teamName.isBlank()) {

            throw new RuntimeException(
                    "Team name is required"
            );
        }

        Team team = new Team();

        team.setName(teamName.trim());
        team.setOwner(owner);

        return teamRepository.save(team);
    }

    public List<Team> getMyTeams(User user) {

    List<Team> teams = new ArrayList<>(
            teamRepository.findByOwner(user)
    );

    List<TeamMember> memberships =
            teamMemberRepository.findByUser(user);

    for (TeamMember membership : memberships) {

        if (!membership.isActive()) {
            continue;
        }

        Team team = membership.getTeam();

        boolean alreadyAdded = teams.stream()
                .anyMatch(existingTeam ->
                        existingTeam.getId().equals(team.getId()));

        if (!alreadyAdded) {
            teams.add(team);
        }
    }

    return teams;
}

    public Team getTeamForUser(
            Long teamId,
            User user) {

        Team team =
                teamRepository.findById(teamId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Team not found"
                                ));

        if (team.getOwner().getId()
                .equals(user.getId())) {

            return team;
        }

        TeamMember member =
                teamMemberRepository
                        .findByTeamAndUser(team, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You are not a member of this team"
                                ));

        if (!member.isActive()) {
            throw new RuntimeException(
                    "Your team membership is inactive"
            );
        }

        return team;
    }

    public TeamMember addMember(
            Long teamId,
            String userEmail,
            PermissionLevel permissionLevel,
            User owner) {

        Team team =
                getTeamForOwner(teamId, owner);

        User user =
                userRepository.findByEmail(userEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        if (user.getId().equals(owner.getId())) {
            throw new RuntimeException(
                    "Team owner is already a team member"
            );
        }

        if (permissionLevel == null) {
            throw new RuntimeException(
                    "Permission level is required"
            );
        }

        if (teamMemberRepository
                .findByTeamAndUser(team, user)
                .isPresent()) {

            throw new RuntimeException(
                    "User is already a member of this team"
            );
        }

        TeamMember member =
                new TeamMember();

        member.setTeam(team);
        member.setUser(user);
        member.setPermissionLevel(permissionLevel);
        member.setActive(true);

        return teamMemberRepository.save(member);
    }

    public List<TeamMember> getTeamMembers(
            Long teamId,
            User user) {

        Team team =
                getTeamForUser(teamId, user);

        return teamMemberRepository.findByTeam(team);
    }

    public TeamCredential addCredentialToTeam(
            Long teamId,
            Long credentialId,
            User user) {

        Team team =
                getTeamForOwner(teamId, user);

        Credential credential =
                credentialRepository.findById(credentialId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                ));

        if (!credential.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Only the credential owner can add it to the team"
            );
        }

        if (teamCredentialRepository
                .findByTeamAndCredential(
                        team,
                        credential
                )
                .isPresent()) {

            throw new RuntimeException(
                    "Credential is already added to this team"
            );
        }

        TeamCredential teamCredential =
                new TeamCredential();

        teamCredential.setTeam(team);
        teamCredential.setCredential(credential);

        return teamCredentialRepository.save(
                teamCredential
        );
    }

    public List<TeamCredential> getTeamCredentials(
            Long teamId,
            User user) {

        Team team =
                getTeamForUser(teamId, user);

        return teamCredentialRepository
                .findByTeam(team);
    }

    public void removeMember(
            Long teamId,
            Long memberId,
            User owner) {

        Team team =
                getTeamForOwner(teamId, owner);

        TeamMember member =
                teamMemberRepository.findById(memberId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Team member not found"
                                ));

        if (!member.getTeam().getId()
                .equals(team.getId())) {

            throw new RuntimeException(
                    "Team member does not belong to this team"
            );
        }

        member.setActive(false);

        teamMemberRepository.save(member);
    }

    public void removeCredentialFromTeam(
            Long teamId,
            Long teamCredentialId,
            User owner) {

        Team team =
                getTeamForOwner(teamId, owner);

        TeamCredential teamCredential =
                teamCredentialRepository
                        .findById(teamCredentialId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Team credential not found"
                                ));

        if (!teamCredential.getTeam().getId()
                .equals(team.getId())) {

            throw new RuntimeException(
                    "Credential does not belong to this team"
            );
        }

        teamCredentialRepository.delete(
                teamCredential
        );
    }
public void updateTeamCredential(
        Long teamId,
        Long teamCredentialId,
        Credential updatedCredential,
        User user) {

    verifyEditAccess(teamId, user);

    TeamCredential teamCredential =
            teamCredentialRepository
                    .findById(teamCredentialId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Team credential not found"
                            ));

    if (!teamCredential.getTeam().getId()
            .equals(teamId)) {

        throw new RuntimeException(
                "Credential does not belong to this team"
        );
    }

    Credential credential =
            teamCredential.getCredential();

    credential.setTitle(
            updatedCredential.getTitle()
    );

    credential.setUsername(
            updatedCredential.getUsername()
    );

    String plainPassword =
            updatedCredential.getPassword();

    credential.setPassword(
            encryptionService.encrypt(
                    plainPassword
            )
    );

    credential.setUrl(
            updatedCredential.getUrl()
    );

    credential.setNotes(
            updatedCredential.getNotes()
    );

    credentialRepository.save(credential);
}

public void deleteTeamCredential(
        Long teamId,
        Long teamCredentialId,
        User user) {

    verifyManagementAccess(teamId, user);

    TeamCredential teamCredential =
            teamCredentialRepository
                    .findById(teamCredentialId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Team credential not found"
                            ));

    if (!teamCredential.getTeam().getId()
            .equals(teamId)) {

        throw new RuntimeException(
                "Credential does not belong to this team"
        );
    }

    teamCredentialRepository.delete(
            teamCredential
    );
}
    public void verifyEditAccess(
            Long teamId,
            User user) {

        Team team =
                getTeamForUser(teamId, user);

        if (team.getOwner().getId()
                .equals(user.getId())) {

            return;
        }

        TeamMember member =
                teamMemberRepository
                        .findByTeamAndUser(team, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You are not a member of this team"
                                ));

        if (!member.isActive()) {
            throw new RuntimeException(
                    "Your team membership is inactive"
            );
        }

        if (member.getPermissionLevel()
                != PermissionLevel.EDIT &&
                member.getPermissionLevel()
                        != PermissionLevel.FULL_MANAGEMENT) {

            throw new RuntimeException(
                    "You do not have permission to edit team credentials"
            );
        }
    }

    public void verifyManagementAccess(
            Long teamId,
            User user) {

        Team team =
                getTeamForUser(teamId, user);

        if (team.getOwner().getId()
                .equals(user.getId())) {

            return;
        }

        TeamMember member =
                teamMemberRepository
                        .findByTeamAndUser(team, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You are not a member of this team"
                                ));

        if (!member.isActive()) {
            throw new RuntimeException(
                    "Your team membership is inactive"
            );
        }

        if (member.getPermissionLevel()
                != PermissionLevel.FULL_MANAGEMENT) {

            throw new RuntimeException(
                    "You do not have full management permission"
            );
        }
    }

    private Team getTeamForOwner(
            Long teamId,
            User owner) {

        Team team =
                teamRepository.findById(teamId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Team not found"
                                ));

        if (!team.getOwner().getId()
                .equals(owner.getId())) {

            throw new RuntimeException(
                    "Only the team owner can perform this action"
            );
        }

        return team;
    }
}
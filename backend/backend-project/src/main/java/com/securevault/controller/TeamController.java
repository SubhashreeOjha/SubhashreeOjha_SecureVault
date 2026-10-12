package com.securevault.controller;

import com.securevault.entity.PermissionLevel;
import com.securevault.entity.Team;
import com.securevault.entity.TeamCredential;
import com.securevault.entity.TeamMember;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;
import com.securevault.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:5173")
public class TeamController {

    private final TeamService teamService;
    private final UserRepository userRepository;

    public TeamController(
            TeamService teamService,
            UserRepository userRepository) {

        this.teamService = teamService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createTeam(
            @RequestParam String name,
            Authentication authentication) {
                

        User user = getCurrentUser(authentication);

        try {

            Team team =
                    teamService.createTeam(name, user);

            return ResponseEntity.ok(team);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyTeams(
            Authentication authentication) {
                

        User user = getCurrentUser(authentication);

        return ResponseEntity.ok(
                teamService.getMyTeams(user)
        );
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<?> getTeamMembers(
            @PathVariable Long teamId,
            Authentication authentication) {

        User user = getCurrentUser(authentication);

        try {

            List<TeamMember> members =
                    teamService.getTeamMembers(
                            teamId,
                            user
                    );

            return ResponseEntity.ok(members);

        } catch (RuntimeException e) {

            return ResponseEntity.status(403)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{teamId}/members")
    public ResponseEntity<?> addMember(
            @PathVariable Long teamId,
            @RequestParam String email,
            @RequestParam PermissionLevel permissionLevel,
            Authentication authentication) {

        User user = getCurrentUser(authentication);

        try {

            TeamMember member =
                    teamService.addMember(
                            teamId,
                            email,
                            permissionLevel,
                            user
                    );

            return ResponseEntity.ok(member);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    @PutMapping("/{teamId}/credentials/{teamCredentialId}")
    public ResponseEntity<?> updateTeamCredential(
            @PathVariable Long teamId,
            @PathVariable Long teamCredentialId,
            @RequestBody com.securevault.entity.Credential updatedCredential,
            Authentication authentication) {

        User user = getCurrentUser(authentication);

        try {

            teamService.updateTeamCredential(
                    teamId,
                    teamCredentialId,
                    updatedCredential,
                    user
            );

            return ResponseEntity.ok(
                    "Team credential updated successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(403)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{teamId}/credentials/{teamCredentialId}/delete")
    public ResponseEntity<?> deleteTeamCredential(
            @PathVariable Long teamId,
            @PathVariable Long teamCredentialId,
            Authentication authentication) {

        User user = getCurrentUser(authentication);

        try {

            teamService.deleteTeamCredential(
                    teamId,
                    teamCredentialId,
                    user
            );

            return ResponseEntity.ok(
                    "Team credential deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(403)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{teamId}/members/{memberId}")
    public ResponseEntity<?> removeMember(
            @PathVariable Long teamId,
            @PathVariable Long memberId,
            Authentication authentication) {

        User user = getCurrentUser(authentication);

        try {

            teamService.removeMember(
                    teamId,
                    memberId,
                    user
            );

            return ResponseEntity.ok(
                    "Team member removed successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{teamId}/credentials/{credentialId}")
    public ResponseEntity<?> addCredentialToTeam(
            @PathVariable Long teamId,
            @PathVariable Long credentialId,
            Authentication authentication) {

        User user = getCurrentUser(authentication);

        try {

            TeamCredential teamCredential =
                    teamService.addCredentialToTeam(
                            teamId,
                            credentialId,
                            user
                    );

            return ResponseEntity.ok(teamCredential);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{teamId}/credentials")
    public ResponseEntity<?> getTeamCredentials(
            @PathVariable Long teamId,
            Authentication authentication) {

        User user = getCurrentUser(authentication);

        try {

            List<TeamCredential> credentials =
                    teamService.getTeamCredentials(
                            teamId,
                            user
                    );

            return ResponseEntity.ok(credentials);

        } catch (RuntimeException e) {

            return ResponseEntity.status(403)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{teamId}/credentials/{teamCredentialId}")
    public ResponseEntity<?> removeCredentialFromTeam(
            @PathVariable Long teamId,
            @PathVariable Long teamCredentialId,
            Authentication authentication) {

        User user = getCurrentUser(authentication);

        try {

            teamService.removeCredentialFromTeam(
                    teamId,
                    teamCredentialId,
                    user
            );

            return ResponseEntity.ok(
                    "Credential removed from team successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    private User getCurrentUser(
            Authentication authentication) {

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));
    }
}

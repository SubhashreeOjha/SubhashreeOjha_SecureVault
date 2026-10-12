package com.securevault.repository;

import com.securevault.entity.Team;
import com.securevault.entity.TeamMember;
import com.securevault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamMemberRepository
        extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findByTeam(Team team);

    List<TeamMember> findByUser(User user);

    Optional<TeamMember> findByTeamAndUser(
            Team team,
            User user
    );
}
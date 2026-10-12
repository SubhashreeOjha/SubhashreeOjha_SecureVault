package com.securevault.repository;

import com.securevault.entity.Team;
import com.securevault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository
        extends JpaRepository<Team, Long> {

    List<Team> findByOwner(User owner);
}
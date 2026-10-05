package com.securevault.repository;
import com.securevault.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface UserSessionRepository extends JpaRepository<UserSession,Long>{ List<UserSession> findByUserOrderByLastSeenDesc(User u); Optional<UserSession> findByTokenHash(String h); }

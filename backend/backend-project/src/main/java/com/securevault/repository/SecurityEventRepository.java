package com.securevault.repository;
import com.securevault.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.time.LocalDateTime; import java.util.*;
public interface SecurityEventRepository extends JpaRepository<SecurityEvent,Long>{ List<SecurityEvent> findByUserAndCreatedAtBetweenOrderByCreatedAtDesc(User u,LocalDateTime a,LocalDateTime b); List<SecurityEvent> findTop10ByUserOrderByCreatedAtDesc(User u); long countByUserAndStatusAndCreatedAtBetween(User u,String s,LocalDateTime a,LocalDateTime b); }

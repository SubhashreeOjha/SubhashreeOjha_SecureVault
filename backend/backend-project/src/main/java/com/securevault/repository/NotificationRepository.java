package com.securevault.repository;
import com.securevault.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface NotificationRepository extends JpaRepository<Notification,Long>{ List<Notification> findByUserOrderByCreatedAtDesc(User u); long countByUserAndReadFalse(User u); }

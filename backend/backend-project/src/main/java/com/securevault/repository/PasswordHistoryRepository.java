package com.securevault.repository;
import com.securevault.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory,Long>{ List<PasswordHistory> findTop5ByUserOrderByChangedAtDesc(User u); }

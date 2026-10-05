package com.securevault.repository;
import com.securevault.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken,Long>{ Optional<PasswordResetToken> findByToken(String token); }

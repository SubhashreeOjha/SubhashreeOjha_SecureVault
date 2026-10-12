package com.securevault.repository;
import com.securevault.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface CredentialRepository extends JpaRepository<Credential,Long>{ List<Credential> findByUser(User u); }

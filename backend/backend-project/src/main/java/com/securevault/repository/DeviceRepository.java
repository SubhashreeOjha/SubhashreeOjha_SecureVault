package com.securevault.repository;
import com.securevault.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface DeviceRepository extends JpaRepository<Device,Long>{ List<Device> findByUserOrderByLastSeenDesc(User u); Optional<Device> findByUserAndFingerprint(User u,String f); }

package com.securevault.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="user_sessions")
public class UserSession {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne @JoinColumn(name="user_id") private User user;
 @Column(nullable=false) private String tokenHash; private String device; private String ipAddress; private String browser;
 private boolean active=true; private LocalDateTime createdAt=LocalDateTime.now(); private LocalDateTime lastSeen=LocalDateTime.now();
 public Long getId(){return id;} public void setId(Long v){id=v;} public User getUser(){return user;} public void setUser(User v){user=v;}
 public String getTokenHash(){return tokenHash;} public void setTokenHash(String v){tokenHash=v;} public String getDevice(){return device;} public void setDevice(String v){device=v;}
 public String getIpAddress(){return ipAddress;} public void setIpAddress(String v){ipAddress=v;} public String getBrowser(){return browser;} public void setBrowser(String v){browser=v;}
 public boolean isActive(){return active;} public void setActive(boolean v){active=v;} public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
 public LocalDateTime getLastSeen(){return lastSeen;} public void setLastSeen(LocalDateTime v){lastSeen=v;}
}

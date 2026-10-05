package com.securevault.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="password_history")
public class PasswordHistory {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne @JoinColumn(name="user_id") private User user;
 private String passwordHash; private LocalDateTime changedAt=LocalDateTime.now();
 public Long getId(){return id;} public void setId(Long v){id=v;} public User getUser(){return user;} public void setUser(User v){user=v;}
 public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String v){passwordHash=v;} public LocalDateTime getChangedAt(){return changedAt;} public void setChangedAt(LocalDateTime v){changedAt=v;}
}

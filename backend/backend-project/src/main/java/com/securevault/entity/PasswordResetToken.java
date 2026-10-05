package com.securevault.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="password_reset_tokens")
public class PasswordResetToken {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(unique=true,nullable=false) private String token;
 @ManyToOne @JoinColumn(name="user_id") private User user;
 private LocalDateTime expiresAt; private boolean used=false;
 public Long getId(){return id;} public void setId(Long v){id=v;} public String getToken(){return token;} public void setToken(String v){token=v;}
 public User getUser(){return user;} public void setUser(User v){user=v;} public LocalDateTime getExpiresAt(){return expiresAt;} public void setExpiresAt(LocalDateTime v){expiresAt=v;}
 public boolean isUsed(){return used;} public void setUsed(boolean v){used=v;}
}

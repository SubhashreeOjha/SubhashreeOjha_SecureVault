package com.securevault.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="notifications")
public class Notification {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne @JoinColumn(name="user_id") private User user;
 private String category; private String title; @Column(length=2000) private String message;
 private boolean read=false; private LocalDateTime createdAt=LocalDateTime.now();
 public Long getId(){return id;} public void setId(Long v){id=v;} public User getUser(){return user;} public void setUser(User v){user=v;}
 public String getCategory(){return category;} public void setCategory(String v){category=v;} public String getTitle(){return title;} public void setTitle(String v){title=v;}
 public String getMessage(){return message;} public void setMessage(String v){message=v;} public boolean isRead(){return read;} public void setRead(boolean v){read=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
}

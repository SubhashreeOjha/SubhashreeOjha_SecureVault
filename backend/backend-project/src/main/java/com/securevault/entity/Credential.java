package com.securevault.entity;
import jakarta.persistence.*; import jakarta.validation.constraints.NotBlank; import java.time.LocalDateTime;
@Entity @Table(name="credentials")
public class Credential {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @NotBlank(message="Title is required") private String title;
 @NotBlank(message="Username is required") private String username;
 @NotBlank(message="Password is required") private String password;
 private String url;
 @Column(length=2000) private String notes;
 private String category="General";
 private String credentialType="LOGIN";
 private boolean favorite=false;
 @Column(length=1000) private String tags; private LocalDateTime passwordExpiresAt;
 @ManyToOne @JoinColumn(name="user_id") private User user;
 public Credential(){}
 public Long getId(){return id;} public void setId(Long v){id=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;}
 public String getUsername(){return username;} public void setUsername(String v){username=v;}
 public String getPassword(){return password;} public void setPassword(String v){password=v;}
 public String getUrl(){return url;} public void setUrl(String v){url=v;}
 public String getNotes(){return notes;} public void setNotes(String v){notes=v;}
 public String getCategory(){return category;} public void setCategory(String v){category=v;}
 public String getCredentialType(){return credentialType;} public void setCredentialType(String v){credentialType=v;}
 public boolean isFavorite(){return favorite;} public void setFavorite(boolean v){favorite=v;}
 public String getTags(){return tags;} public void setTags(String v){tags=v;} public LocalDateTime getPasswordExpiresAt(){return passwordExpiresAt;} public void setPasswordExpiresAt(LocalDateTime v){passwordExpiresAt=v;}
 public User getUser(){return user;} public void setUser(User v){user=v;}
}

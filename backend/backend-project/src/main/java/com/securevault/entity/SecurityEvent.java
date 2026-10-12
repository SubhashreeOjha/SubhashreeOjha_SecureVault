package com.securevault.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="security_events")
public class SecurityEvent {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne @JoinColumn(name="user_id") private User user;
 @Column(nullable=false) private String eventType;
 @Column(nullable=false) private String status;
 private String ipAddress; private String device; private String browser;
 private boolean suspicious=false; private String riskLevel="LOW"; private String details;
 private LocalDateTime createdAt=LocalDateTime.now();
 public Long getId(){return id;} public void setId(Long v){id=v;} public User getUser(){return user;} public void setUser(User v){user=v;}
 public String getEventType(){return eventType;} public void setEventType(String v){eventType=v;} public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public String getIpAddress(){return ipAddress;} public void setIpAddress(String v){ipAddress=v;} public String getDevice(){return device;} public void setDevice(String v){device=v;}
 public String getBrowser(){return browser;} public void setBrowser(String v){browser=v;} public boolean isSuspicious(){return suspicious;} public void setSuspicious(boolean v){suspicious=v;}
 public String getRiskLevel(){return riskLevel;} public void setRiskLevel(String v){riskLevel=v;} public String getDetails(){return details;} public void setDetails(String v){details=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
}

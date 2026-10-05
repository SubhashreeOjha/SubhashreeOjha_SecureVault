package com.securevault.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="devices")
public class Device {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne @JoinColumn(name="user_id") private User user;
 private String fingerprint; private String name; private String browser; private String ipAddress; private LocalDateTime firstSeen=LocalDateTime.now(); private LocalDateTime lastSeen=LocalDateTime.now(); private boolean trusted=false;
 public Long getId(){return id;} public void setId(Long v){id=v;} public User getUser(){return user;} public void setUser(User v){user=v;} public String getFingerprint(){return fingerprint;} public void setFingerprint(String v){fingerprint=v;}
 public String getName(){return name;} public void setName(String v){name=v;} public String getBrowser(){return browser;} public void setBrowser(String v){browser=v;} public String getIpAddress(){return ipAddress;} public void setIpAddress(String v){ipAddress=v;}
 public LocalDateTime getFirstSeen(){return firstSeen;} public void setFirstSeen(LocalDateTime v){firstSeen=v;} public LocalDateTime getLastSeen(){return lastSeen;} public void setLastSeen(LocalDateTime v){lastSeen=v;} public boolean isTrusted(){return trusted;} public void setTrusted(boolean v){trusted=v;}
}

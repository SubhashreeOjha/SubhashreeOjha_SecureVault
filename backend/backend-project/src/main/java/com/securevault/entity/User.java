package com.securevault.entity;
import jakarta.persistence.*;
@Entity @Table(name="users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name;
 @Column(nullable=false,unique=true) private String email;
 @Column(nullable=false) private String password;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role=Role.USER;
 private boolean mfaEnabled=false;
 @Column(length=128) private String mfaSecret;
 public User(){}
 public User(String name,String email,String password){this.name=name;this.email=email;this.password=password;}
 public Long getId(){return id;} public void setId(Long id){this.id=id;}
 public String getName(){return name;} public void setName(String v){name=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v;}
 public String getPassword(){return password;} public void setPassword(String v){password=v;}
 public Role getRole(){return role;} public void setRole(Role v){role=v;}
 public boolean isMfaEnabled(){return mfaEnabled;} public void setMfaEnabled(boolean v){mfaEnabled=v;}
 public String getMfaSecret(){return mfaSecret;} public void setMfaSecret(String v){mfaSecret=v;}
}
package com.securevault.service;
import com.securevault.entity.*; import com.securevault.repository.NotificationRepository; import org.springframework.mail.javamail.JavaMailSender; import org.springframework.stereotype.Service; import org.springframework.mail.SimpleMailMessage; import java.util.*;
@Service public class NotificationService{
 private final NotificationRepository repo; private final JavaMailSender mail; private final PushNotificationService push;
 public NotificationService(NotificationRepository r,JavaMailSender m,PushNotificationService p){repo=r;mail=m;push=p;}
 public Notification create(User u,String category,String title,String message){Notification n=new Notification();n.setUser(u);n.setCategory(category);n.setTitle(title);n.setMessage(message);Notification saved=repo.save(n);push.send(u,title,message);return saved;}
 public List<Notification> list(User u){return repo.findByUserOrderByCreatedAtDesc(u);} public long unread(User u){return repo.countByUserAndReadFalse(u);}
 public void markRead(Long id,User u){Notification n=repo.findById(id).orElseThrow(); if(!n.getUser().getId().equals(u.getId()))throw new RuntimeException("Forbidden");n.setRead(true);repo.save(n);}
 public void email(User u,String subject,String body){try{SimpleMailMessage m=new SimpleMailMessage();m.setTo(u.getEmail());m.setSubject(subject);m.setText(body);mail.send(m);}catch(Exception ignored){}}
}

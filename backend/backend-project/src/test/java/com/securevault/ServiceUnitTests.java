package com.securevault;

import com.securevault.entity.*;
import com.securevault.repository.*;
import com.securevault.service.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceUnitTests {

    @Mock
    CredentialRepository cr;

    @Mock
    EncryptionService enc;

    @Mock
    UserRepository ur;

    @Mock
    PasswordEncoder pe;

    @Mock
    CredentialShareRepository sr;

    @Mock
    NotificationRepository nr;

    @Mock
    PasswordResetTokenRepository tr;

    @Mock
    SecurityEventRepository er;

    @Mock
    DeviceRepository dr;

    @Mock
    UserSessionRepository usr;

    @Mock
    PasswordHistoryRepository phr;

    @Mock
    AnalyticsCacheService cache;


    User user() {
        return new User(
                "Test",
                "test@example.com",
                "hash"
        );
    }


    NotificationService ns() {
        return new NotificationService(
                nr,
                mock(JavaMailSender.class),
                mock(PushNotificationService.class)
        );
    }


    @Test
    void credentialAddSetsOwner() {

        CredentialService s =
                new CredentialService(cr, enc);

        Credential c = new Credential();

        c.setTitle("Google");
        c.setUsername("u");
        c.setPassword("p");

        when(enc.encrypt("p"))
                .thenReturn("GCM:p");

        when(cr.save(any()))
                .thenAnswer(x -> x.getArgument(0));

        Credential r =
                s.addCredential(c, user());

        assertEquals("p", r.getPassword());
        assertNotNull(r.getUser());
    }


    @Test
    void credentialListEmpty() {

        when(cr.findByUser(any()))
                .thenReturn(List.of());

        assertTrue(
                new CredentialService(cr, enc)
                        .getUserCredentials(user())
                        .isEmpty()
        );
    }


    @Test
    void credentialUpdateRejectsForeignOwner() {

        CredentialService s =
                new CredentialService(cr, enc);

        Credential c = new Credential();
        c.setUser(user());

        when(cr.findById(1L))
                .thenReturn(Optional.of(c));

        assertThrows(
                RuntimeException.class,
                () -> s.updateCredential(
                        1L,
                        new Credential(),
                        new User(
                                "Other",
                                "other@example.com",
                                "x"
                        )
                )
        );
    }


    @Test
    void credentialDeleteRejectsForeignOwner() {

        Credential c = new Credential();
        c.setUser(user());

        when(cr.findById(1L))
                .thenReturn(Optional.of(c));

        assertThrows(
                RuntimeException.class,
                () -> new CredentialService(cr, enc)
                        .deleteCredential(
                                1L,
                                new User(
                                        "Other",
                                        "other@example.com",
                                        "x"
                                )
                        )
        );
    }


    @Test
    void authHashesPassword() {

        when(ur.findByEmail("a@b.com"))
                .thenReturn(Optional.empty());

        when(pe.encode("Secret123"))
                .thenReturn("HASH");

        when(ur.save(any()))
                .thenAnswer(x -> x.getArgument(0));

        User u =
                new AuthService(
                        ur,
                        pe
                ).register(
                        "A",
                        "a@b.com",
                        "Secret123"
                );

        assertEquals(
                "HASH",
                u.getPassword()
        );

        verify(pe).encode("Secret123");
    }


    @Test
    void authRejectsDuplicate() {

        when(ur.findByEmail("a@b.com"))
                .thenReturn(Optional.of(user()));

        assertThrows(
                RuntimeException.class,
                () -> new AuthService(
                        ur,
                        pe
                ).register(
                        "A",
                        "a@b.com",
                        "Secret123"
                )
        );
    }


    @Test
    void mfaSecretLength() {

        assertTrue(
                new MfaService()
                        .newSecret()
                        .length() > 20
        );
    }


    @Test
    void mfaCodeFormat() {

        MfaService m =
                new MfaService();

        assertTrue(
                m.currentCode(
                        m.newSecret()
                ).matches("\\d{6}")
        );
    }


    @Test
    void mfaRejectsBadCode() {

        MfaService m =
                new MfaService();

        assertFalse(
                m.verify(
                        m.newSecret(),
                        "000000"
                )
        );
    }


    @Test
    void mfaCurrentCodeValid() {

        MfaService m =
                new MfaService();

        String secret =
                m.newSecret();

        assertTrue(
                m.verify(
                        secret,
                        m.currentCode(secret)
                )
        );
    }


    @Test
    void sessionHashDeterministic() {

        SessionService s =
                new SessionService(usr);

        assertEquals(
                s.hash("abc"),
                s.hash("abc")
        );
    }


    @Test
    void sessionHashDifferent() {

        SessionService s =
                new SessionService(usr);

        assertNotEquals(
                s.hash("abc"),
                s.hash("def")
        );
    }


    @Test
    void notificationCreate() {

        when(nr.save(any()))
                .thenAnswer(x -> x.getArgument(0));

        assertEquals(
                "LOGIN",
                ns().create(
                        user(),
                        "LOGIN",
                        "Login",
                        "ok"
                ).getCategory()
        );
    }


    @Test
    void notificationUnread() {

        when(
                nr.countByUserAndReadFalse(any())
        ).thenReturn(2L);

        assertEquals(
                2,
                ns().unread(user())
        );
    }


    @Test
    void recoveryRejectsShortPassword() {

        PasswordRecoveryService s =
                new PasswordRecoveryService(
                        ur,
                        tr,
                        pe,
                        ns(),
                        new PasswordHistoryService(
                                phr,
                                pe
                        )
                );

        assertThrows(
                RuntimeException.class,
                () -> s.reset(
                        "x",
                        "short"
                )
        );
    }


    @Test
    void recoveryRejectsMissingToken() {

        when(tr.findByToken("x"))
                .thenReturn(Optional.empty());

        PasswordRecoveryService s =
                new PasswordRecoveryService(
                        ur,
                        tr,
                        pe,
                        ns(),
                        new PasswordHistoryService(
                                phr,
                                pe
                        )
                );

        assertThrows(
                RuntimeException.class,
                () -> s.reset(
                        "x",
                        "longpassword"
                )
        );
    }


    @Test
    void analyticsCreatesEvent() {

        when(er.save(any()))
                .thenAnswer(x -> x.getArgument(0));

        when(
                er.countByUserAndStatusAndCreatedAtBetween(
                        any(),
                        any(),
                        any(),
                        any()
                )
        ).thenReturn(0L);

        SecurityMonitoringService s =
                new SecurityMonitoringService(
                        er,
                        dr,
                        ns(),
                        usr,
                        cache
                );

        assertEquals(
                "LOGIN",
                s.record(
                        user(),
                        "LOGIN",
                        "SUCCESS",
                        "127.0.0.1",
                        "ok"
                ).getEventType()
        );
    }


    @Test
    void analyticsCountsSuccess() {

        SecurityEvent e =
                new SecurityEvent();

        e.setStatus("SUCCESS");
        e.setEventType("LOGIN");

        when(
                er.findByUserAndCreatedAtBetweenOrderByCreatedAtDesc(
                        any(User.class),
                        any(LocalDateTime.class),
                        any(LocalDateTime.class)
                )
        ).thenReturn(List.of(e));

        Map<String, Object> m =
                new SecurityMonitoringService(
                        er,
                        dr,
                        ns(),
                        usr,
                        cache
                ).analytics(
                        user(),
                        LocalDateTime.now().minusDays(1),
                        LocalDateTime.now()
                );

        assertEquals(
                1L,
                m.get("successfulLogins")
        );
    }


    @Test
    void analyticsCountsFailed() {

        SecurityEvent e =
                new SecurityEvent();

        e.setStatus("FAILED");

        when(
                er.findByUserAndCreatedAtBetweenOrderByCreatedAtDesc(
                        any(User.class),
                        any(LocalDateTime.class),
                        any(LocalDateTime.class)
                )
        ).thenReturn(List.of(e));

        assertEquals(
                1L,
                new SecurityMonitoringService(
                        er,
                        dr,
                        ns(),
                        usr,
                        cache
                ).analytics(
                        user(),
                        LocalDateTime.now().minusDays(1),
                        LocalDateTime.now()
                ).get("failedLogins")
        );
    }


    @Test
    void analyticsCountsSuspicious() {

        SecurityEvent e =
                new SecurityEvent();

        e.setStatus("OPEN");
        e.setSuspicious(true);

        when(
                er.findByUserAndCreatedAtBetweenOrderByCreatedAtDesc(
                        any(User.class),
                        any(LocalDateTime.class),
                        any(LocalDateTime.class)
                )
        ).thenReturn(List.of(e));

        assertEquals(
                1L,
                new SecurityMonitoringService(
                        er,
                        dr,
                        ns(),
                        usr,
                        cache
                ).analytics(
                        user(),
                        LocalDateTime.now().minusDays(1),
                        LocalDateTime.now()
                ).get("suspiciousActivities")
        );
    }


    @Test
    void deviceListUsesRepository() {

        when(
                dr.findByUserOrderByLastSeenDesc(any())
        ).thenReturn(List.of());

        assertTrue(
                new SecurityMonitoringService(
                        er,
                        dr,
                        ns(),
                        usr,
                        cache
                ).deviceList(user()).isEmpty()
        );
    }


    @Test
    void roleDefaultsUser() {

        assertEquals(
                Role.USER,
                user().getRole()
        );
    }


    @Test
    void credentialFavoriteDefaultFalse() {

        assertFalse(
                new Credential().isFavorite()
        );
    }


    @Test
    void notificationDefaultUnread() {

        assertFalse(
                new Notification().isRead()
        );
    }


    @Test
    void eventDefaultLowRisk() {

        assertEquals(
                "LOW",
                new SecurityEvent().getRiskLevel()
        );
    }


    @Test
    void sessionDefaultActive() {

        assertTrue(
                new UserSession().isActive()
        );
    }


    @Test
    void resetTokenDefaultUnused() {

        assertFalse(
                new PasswordResetToken().isUsed()
        );
    }


    @Test
    void historyRecordsHash() {

        when(phr.save(any()))
                .thenAnswer(x -> x.getArgument(0));

        new PasswordHistoryService(
                phr,
                pe
        ).record(
                user(),
                "hash"
        );

        verify(phr)
                .save(any(PasswordHistory.class));
    }


    @Test
    void historyDetectsReuse() {

        PasswordHistory h =
                new PasswordHistory();

        h.setPasswordHash("hash");

        when(
                phr.findTop5ByUserOrderByChangedAtDesc(any())
        ).thenReturn(List.of(h));

        when(
                pe.matches(
                        "secret",
                        "hash"
                )
        ).thenReturn(true);

        assertTrue(
                new PasswordHistoryService(
                        phr,
                        pe
                ).wasRecentlyUsed(
                        user(),
                        "secret"
                )
        );
    }


    @Test
    void cacheFallbackSafe() {

        when(cache.get("x"))
                .thenReturn(null);

        assertNull(
                cache.get("x")
        );
    }
}
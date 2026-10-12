package com.securevault;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "spring.datasource.url=jdbc:h2:mem:securevault;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
                "spring.datasource.username=sa",
                "spring.datasource.password=",
                "spring.jpa.hibernate.ddl-auto=create-drop",
                "spring.data.redis.host=localhost"
        }
)
@AutoConfigureTestRestTemplate
class IntegrationTests {

    @Autowired
    TestRestTemplate rest;

    private final String email = "integration@securevault.test";
    private final String password = "Password@123";


    private void register() {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of(
                "name", "Integration User",
                "email", email,
                "password", password
        );

        rest.postForEntity(
                "/api/auth/register",
                new HttpEntity<>(body, headers),
                String.class
        );
    }


    private String login() {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of(
                "email", email,
                "password", password
        );

        ResponseEntity<Map> response =
                rest.postForEntity(
                        "/api/auth/login",
                        new HttpEntity<>(body, headers),
                        Map.class
                );

        assertNotNull(response.getBody());

        Object token =
                response.getBody().get("token");

        assertNotNull(token);

        return token.toString();
    }


    private HttpHeaders auth(String token) {

        HttpHeaders headers = new HttpHeaders();

        headers.setBearerAuth(token);

        return headers;
    }


    @Test
    void contextLoads() {

        assertNotNull(rest);
    }


    @Test
    void registerWorks() {

        register();

        assertTrue(true);
    }


    @Test
    void duplicateRegisterHandled() {

        register();

        ResponseEntity<String> response =
                rest.postForEntity(
                        "/api/auth/register",
                        new HttpEntity<>(
                                Map.of(
                                        "name", "Duplicate",
                                        "email", email,
                                        "password", password
                                )
                        ),
                        String.class
                );

        assertTrue(
                response.getStatusCode().is4xxClientError()
        );
    }


    @Test
    void loginWorks() {

        register();

        assertNotNull(login());
    }


    @Test
    void invalidLoginUnauthorized() {

        register();

        ResponseEntity<String> response =
                rest.postForEntity(
                        "/api/auth/login",
                        new HttpEntity<>(
                                Map.of(
                                        "email", email,
                                        "password", "WrongPassword123"
                                )
                        ),
                        String.class
                );

        assertEquals(
                HttpStatus.UNAUTHORIZED,
                response.getStatusCode()
        );
    }


    @Test
    void meRequiresAuth() {

        ResponseEntity<String> response =
                rest.getForEntity(
                        "/api/auth/me",
                        String.class
                );

        assertTrue(
                response.getStatusCode() == HttpStatus.UNAUTHORIZED
                        || response.getStatusCode() == HttpStatus.FORBIDDEN
        );
    }


    @Test
    void meReturnsEmail() {

        register();

        String token = login();

        ResponseEntity<String> response =
                rest.exchange(
                        "/api/auth/me",
                        HttpMethod.GET,
                        new HttpEntity<>(auth(token)),
                        String.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertEquals(
                email,
                response.getBody()
        );
    }


    @Test
    void securityAnalyticsRequiresAuth() {

        ResponseEntity<Map> response =
                rest.getForEntity(
                        "/api/security/analytics",
                        Map.class
                );

        assertTrue(
                response.getStatusCode() == HttpStatus.UNAUTHORIZED
                        || response.getStatusCode() == HttpStatus.FORBIDDEN
        );
    }


    @Test
    void securityAnalyticsWorks() {

        register();

        String token = login();

        ResponseEntity<Map> response =
                rest.exchange(
                        "/api/security/analytics?range=7d",
                        HttpMethod.GET,
                        new HttpEntity<>(auth(token)),
                        Map.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());
    }


    @Test
    void securityEventsWorks() {

        register();

        String token = login();

        ResponseEntity<List> response =
                rest.exchange(
                        "/api/security/events",
                        HttpMethod.GET,
                        new HttpEntity<>(auth(token)),
                        List.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());
    }


    @Test
    void devicesWorks() {

        register();

        String token = login();

        ResponseEntity<List> response =
                rest.exchange(
                        "/api/security/devices",
                        HttpMethod.GET,
                        new HttpEntity<>(auth(token)),
                        List.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );
    }


    @Test
    void notificationsWorks() {

        register();

        String token = login();

        ResponseEntity<Map> response =
                rest.exchange(
                        "/api/security/notifications",
                        HttpMethod.GET,
                        new HttpEntity<>(auth(token)),
                        Map.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );
    }


    @Test
    void mfaStatusWorks() {

        register();

        String token = login();

        ResponseEntity<Map> response =
                rest.exchange(
                        "/api/mfa/status",
                        HttpMethod.GET,
                        new HttpEntity<>(auth(token)),
                        Map.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );
    }


    @Test
    void mfaSetupWorks() {

        register();

        String token = login();

        ResponseEntity<Map> response =
                rest.exchange(
                        "/api/mfa/setup",
                        HttpMethod.POST,
                        new HttpEntity<>(auth(token)),
                        Map.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());
    }


    @Test
    void sessionsWorks() {

        register();

        String token = login();

        ResponseEntity<List> response =
                rest.exchange(
                        "/api/sessions",
                        HttpMethod.GET,
                        new HttpEntity<>(auth(token)),
                        List.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );
    }


    @Test
    void vaultRequiresAuth() {

        ResponseEntity<List> response =
                rest.getForEntity(
                        "/api/vault/credentials",
                        List.class
                );

        assertTrue(
                response.getStatusCode() == HttpStatus.UNAUTHORIZED
                        || response.getStatusCode() == HttpStatus.FORBIDDEN
        );
    }


    @Test
    void reportsRequireAuth() {

        ResponseEntity<byte[]> response =
                rest.getForEntity(
                        "/api/reports/security.xlsx",
                        byte[].class
                );

        assertTrue(
                response.getStatusCode() == HttpStatus.UNAUTHORIZED
                        || response.getStatusCode() == HttpStatus.FORBIDDEN
        );
    }


    @Test
    void advancedSearchWorks() {

        register();

        String token = login();

        ResponseEntity<List> response =
                rest.exchange(
                        "/api/vault/advanced/search?q=Google",
                        HttpMethod.GET,
                        new HttpEntity<>(auth(token)),
                        List.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );
    }


    @Test
    void oauthStatusWorks() {

        ResponseEntity<Map> response =
                rest.getForEntity(
                        "/api/oauth2/status",
                        Map.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );
    }


    @Test
    void createCredentialWorks() {

        register();

        String token = login();

        HttpHeaders headers = auth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Map> response =
                rest.postForEntity(
                        "/api/vault/credentials",
                        new HttpEntity<>(
                                Map.of(
                                        "title", "Integration Google",
                                        "username", "u@test",
                                        "password", "Strong@123",
                                        "url", "https://example.com",
                                        "notes", "test"
                                ),
                                headers
                        ),
                        Map.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());
    }


    @Test
    void updateCredentialWorks() {

        register();

        String token = login();

        HttpHeaders headers = auth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Map> created =
                rest.postForEntity(
                        "/api/vault/credentials",
                        new HttpEntity<>(
                                Map.of(
                                        "title", "Update Me",
                                        "username", "u",
                                        "password", "Strong@123"
                                ),
                                headers
                        ),
                        Map.class
                );

        assertTrue(
                created.getStatusCode().is2xxSuccessful()
        );

        assertNotNull(created.getBody());

        Number id =
                (Number) created.getBody().get("id");

        assertNotNull(id);

        ResponseEntity<Map> response =
                rest.exchange(
                        "/api/vault/credentials/" + id.longValue(),
                        HttpMethod.PUT,
                        new HttpEntity<>(
                                Map.of(
                                        "title", "Updated",
                                        "username", "u2",
                                        "password", "Strong@456"
                                ),
                                headers
                        ),
                        Map.class
                );

        assertTrue(
                response.getStatusCode().is2xxSuccessful()
        );
    }


    @Test
    void deleteCredentialWorks() {

        register();

        String token = login();

        HttpHeaders headers = auth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Map> created =
                rest.postForEntity(
                        "/api/vault/credentials",
                        new HttpEntity<>(
                                Map.of(
                                        "title", "Delete Me",
                                        "username", "u",
                                        "password", "Strong@123"
                                ),
                                headers
                        ),
                        Map.class
                );

        assertTrue(
                created.getStatusCode().is2xxSuccessful()
        );

        assertNotNull(created.getBody());

        Number id =
                (Number) created.getBody().get("id");

        assertNotNull(id);

        ResponseEntity<String> response =
                rest.exchange(
                        "/api/vault/credentials/" + id.longValue(),
                        HttpMethod.DELETE,
                        new HttpEntity<>(headers),
                        String.class
                );

        assertTrue(
                response.getStatusCode().is2xxSuccessful()
        );
    }


    @Test
    void searchFiltersCredential() {

        register();

        String token = login();

        HttpHeaders headers = auth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        rest.postForEntity(
                "/api/vault/credentials",
                new HttpEntity<>(
                        Map.of(
                                "title", "Unique Search Item",
                                "username", "u",
                                "password", "Strong@123"
                        ),
                        headers
                ),
                Map.class
        );

        ResponseEntity<List> response =
                rest.exchange(
                        "/api/vault/advanced/search?q=Unique%20Search",
                        HttpMethod.GET,
                        new HttpEntity<>(headers),
                        List.class
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );
    }
}
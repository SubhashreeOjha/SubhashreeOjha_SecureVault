package com.securevault.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class EncryptionService {

    private static final String AES_ALGORITHM = "AES";
    private static final String GCM_ALGORITHM = "AES/GCM/NoPadding";

    private static final int GCM_TAG_LENGTH = 128;
    private static final int IV_LENGTH = 12;

    private static final String GCM_PREFIX = "GCM:";

    private final SecretKeySpec secretKey;
    private final SecureRandom secureRandom;

    public EncryptionService(
            @Value("${securevault.encryption-key}") String encryptionKey) {

        if (encryptionKey == null || encryptionKey.length() != 32) {
            throw new IllegalArgumentException(
                    "Encryption key must be exactly 32 characters long"
            );
        }

        this.secretKey = new SecretKeySpec(
                encryptionKey.getBytes(StandardCharsets.UTF_8),
                AES_ALGORITHM
        );

        this.secureRandom = new SecureRandom();
    }

    public String encrypt(String plainText) {

        try {
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(GCM_ALGORITHM);

            GCMParameterSpec parameterSpec =
                    new GCMParameterSpec(GCM_TAG_LENGTH, iv);

            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    secretKey,
                    parameterSpec
            );

            byte[] encryptedBytes =
                    cipher.doFinal(
                            plainText.getBytes(StandardCharsets.UTF_8)
                    );

            byte[] combined =
                    new byte[iv.length + encryptedBytes.length];

            System.arraycopy(
                    iv,
                    0,
                    combined,
                    0,
                    iv.length
            );

            System.arraycopy(
                    encryptedBytes,
                    0,
                    combined,
                    iv.length,
                    encryptedBytes.length
            );

            return GCM_PREFIX +
                    Base64.getEncoder().encodeToString(combined);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Encryption failed",
                    e
            );
        }
    }

    public String decrypt(String encryptedText) {

        try {

            // New AES-GCM encrypted data
            if (encryptedText.startsWith(GCM_PREFIX)) {

                String encodedData =
                        encryptedText.substring(GCM_PREFIX.length());

                byte[] combined =
                        Base64.getDecoder().decode(encodedData);

                byte[] iv =
                        new byte[IV_LENGTH];

                byte[] encryptedBytes =
                        new byte[combined.length - IV_LENGTH];

                System.arraycopy(
                        combined,
                        0,
                        iv,
                        0,
                        IV_LENGTH
                );

                System.arraycopy(
                        combined,
                        IV_LENGTH,
                        encryptedBytes,
                        0,
                        encryptedBytes.length
                );

                Cipher cipher =
                        Cipher.getInstance(GCM_ALGORITHM);

                GCMParameterSpec parameterSpec =
                        new GCMParameterSpec(
                                GCM_TAG_LENGTH,
                                iv
                        );

                cipher.init(
                        Cipher.DECRYPT_MODE,
                        secretKey,
                        parameterSpec
                );

                byte[] decryptedBytes =
                        cipher.doFinal(encryptedBytes);

                return new String(
                        decryptedBytes,
                        StandardCharsets.UTF_8
                );
            }

            // Legacy AES-ECB data from the earlier implementation.
            // This allows existing credentials to remain readable
            // during the migration to AES-GCM.
            Cipher legacyCipher =
                    Cipher.getInstance(AES_ALGORITHM);

            legacyCipher.init(
                    Cipher.DECRYPT_MODE,
                    secretKey
            );

            byte[] decodedBytes =
                    Base64.getDecoder().decode(encryptedText);

            byte[] decryptedBytes =
                    legacyCipher.doFinal(decodedBytes);

            return new String(
                    decryptedBytes,
                    StandardCharsets.UTF_8
            );

        } catch (Exception e) {
            throw new RuntimeException(
                    "Decryption failed",
                    e
            );
        }
    }
}
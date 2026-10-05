package com.securevault.controller;

import com.securevault.entity.Credential;
import com.securevault.entity.SecurityEvent;
import com.securevault.entity.User;
import com.securevault.repository.CredentialRepository;
import com.securevault.repository.SecurityEventRepository;
import com.securevault.repository.UserRepository;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final UserRepository users;
    private final SecurityEventRepository events;
    private final CredentialRepository credentials;

    public ReportController(
            UserRepository users,
            SecurityEventRepository events,
            CredentialRepository credentials) {

        this.users = users;
        this.events = events;
        this.credentials = credentials;
    }

    // =========================================================
    // CURRENT USER
    // =========================================================

    private User currentUser(Authentication authentication) {

        return users.findByEmail(authentication.getName())
                .orElseThrow();
    }

    // =========================================================
    // SECURITY EXCEL
    // =========================================================

    @GetMapping(
            value = "/security.xlsx",
            produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> securityExcel(
            Authentication authentication) throws Exception {

        User user = currentUser(authentication);

        List<List<String>> rows = securityRows(user);

        return excel(
                "Security Report",
                List.of(
                        "Event",
                        "Status",
                        "Risk",
                        "Time"
                ),
                rows
        );
    }

    // =========================================================
    // AUDIT EXCEL
    // =========================================================

    @GetMapping(
            value = "/audit.xlsx",
            produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> auditExcel(
            Authentication authentication) throws Exception {

        User user = currentUser(authentication);

        List<List<String>> rows =
                events.findTop10ByUserOrderByCreatedAtDesc(user)
                        .stream()
                        .map(e -> List.of(
                                String.valueOf(e.getId()),
                                user.getEmail(),
                                safe(e.getEventType()),
                                safe(e.getStatus()),
                                safe(e.getRiskLevel()),
                                safe(String.valueOf(e.getCreatedAt()))
                        ))
                        .toList();

        return excel(
                "Audit Report",
                List.of(
                        "Event ID",
                        "User",
                        "Action / Event",
                        "Status",
                        "Risk Level",
                        "Timestamp"
                ),
                rows
        );
    }

    // =========================================================
    // PASSWORD HEALTH EXCEL
    // =========================================================

    @GetMapping(
            value = "/password-health.xlsx",
            produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> passwordHealthExcel(
            Authentication authentication) throws Exception {

        User user = currentUser(authentication);

        List<Credential> list =
                credentials.findByUser(user);

        long weak = list.stream()
                .filter(c ->
                        c.getPassword() != null &&
                        c.getPassword().length() < 10)
                .count();

        long strong = list.size() - weak;

        long expired = list.stream()
                .filter(c ->
                        c.getPasswordExpiresAt() != null &&
                        c.getPasswordExpiresAt()
                                .isBefore(LocalDateTime.now()))
                .count();

        List<List<String>> rows = new ArrayList<>();

        rows.add(List.of(
                "Total Passwords",
                String.valueOf(list.size())
        ));

        rows.add(List.of(
                "Strong Passwords",
                String.valueOf(strong)
        ));

        rows.add(List.of(
                "Weak Passwords",
                String.valueOf(weak)
        ));

        rows.add(List.of(
                "Expired Passwords",
                String.valueOf(expired)
        ));

        return excel(
                "Password Health Report",
                List.of(
                        "Metric",
                        "Value"
                ),
                rows
        );
    }

    // =========================================================
    // USER ACTIVITY EXCEL
    // =========================================================

    @GetMapping(
            value = "/user-activity.xlsx",
            produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> userActivityExcel(
            Authentication authentication) throws Exception {

        User user = currentUser(authentication);

        List<List<String>> rows =
                events.findTop10ByUserOrderByCreatedAtDesc(user)
                        .stream()
                        .map(e -> List.of(
                                safe(e.getEventType()),
                                safe(e.getStatus()),
                                safe(String.valueOf(e.getCreatedAt()))
                        ))
                        .toList();

        return excel(
                "User Activity Report",
                List.of(
                        "Event",
                        "Status",
                        "Time"
                ),
                rows
        );
    }

    // =========================================================
    // THREAT MONITORING EXCEL
    // =========================================================

    @GetMapping(
            value = "/threat-monitoring.xlsx",
            produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> threatMonitoringExcel(
            Authentication authentication) throws Exception {

        User user = currentUser(authentication);

        List<List<String>> rows =
                securityRows(user)
                        .stream()
                        .filter(row ->
                                !"LOW".equalsIgnoreCase(row.get(2)))
                        .toList();

        return excel(
                "Threat Monitoring Report",
                List.of(
                        "Event",
                        "Status",
                        "Risk",
                        "Time"
                ),
                rows
        );
    }

    // =========================================================
    // SECURITY PDF
    // =========================================================

    @GetMapping(
            value = "/security.pdf",
            produces = "application/pdf")
    public ResponseEntity<byte[]> securityPdf(
            Authentication authentication) {

        User user = currentUser(authentication);

        List<String> lines = new ArrayList<>();

        lines.add("SECUREVAULT SECURITY REPORT");
        lines.add("");
        lines.add(
                "Generated: " +
                LocalDateTime.now()
        );
        lines.add("");

        lines.add(
                "EVENT        STATUS        RISK        TIME"
        );

        lines.add(
                "------------------------------------------------------------"
        );

        for (SecurityEvent e :
                events.findTop10ByUserOrderByCreatedAtDesc(user)) {

            lines.add(
                    safe(e.getEventType()) +
                    "        " +
                    safe(e.getStatus()) +
                    "        " +
                    safe(e.getRiskLevel()) +
                    "        " +
                    safe(String.valueOf(e.getCreatedAt()))
            );
        }

        return pdf(
                lines,
                "security-report.pdf"
        );
    }

    // =========================================================
    // AUDIT PDF
    // =========================================================

    @GetMapping(
            value = "/audit.pdf",
            produces = "application/pdf")
    public ResponseEntity<byte[]> auditPdf(
            Authentication authentication) {

        User user = currentUser(authentication);

        List<String> lines = new ArrayList<>();

        lines.add("SECUREVAULT AUDIT REPORT");
        lines.add("");

        lines.add(
                "Generated: " +
                LocalDateTime.now()
        );

        lines.add("");

        lines.add(
                "USER: " +
                user.getEmail()
        );

        lines.add("");

        lines.add("DETAILED AUDIT TRAIL");

        lines.add(
                "------------------------------------------------------------"
        );

        for (SecurityEvent e :
                events.findTop10ByUserOrderByCreatedAtDesc(user)) {

            lines.add(
                    "Event ID: " +
                    e.getId()
            );

            lines.add(
                    "User: " +
                    user.getEmail()
            );

            lines.add(
                    "Action / Event: " +
                    safe(e.getEventType())
            );

            lines.add(
                    "Status: " +
                    safe(e.getStatus())
            );

            lines.add(
                    "Risk Level: " +
                    safe(e.getRiskLevel())
            );

            lines.add(
                    "Timestamp: " +
                    safe(String.valueOf(e.getCreatedAt()))
            );

            lines.add(
                    "------------------------------------------------------------"
            );
        }

        return pdf(
                lines,
                "audit-report.pdf"
        );
    }

    // =========================================================
    // PASSWORD HEALTH PDF
    // =========================================================

    @GetMapping(
            value = "/password-health.pdf",
            produces = "application/pdf")
    public ResponseEntity<byte[]> passwordHealthPdf(
            Authentication authentication) {

        User user = currentUser(authentication);

        List<Credential> list =
                credentials.findByUser(user);

        long weak = list.stream()
                .filter(c ->
                        c.getPassword() != null &&
                        c.getPassword().length() < 10)
                .count();

        long strong = list.size() - weak;

        long expired = list.stream()
                .filter(c ->
                        c.getPasswordExpiresAt() != null &&
                        c.getPasswordExpiresAt()
                                .isBefore(LocalDateTime.now()))
                .count();

        List<String> lines = new ArrayList<>();

        lines.add(
                "SECUREVAULT PASSWORD HEALTH REPORT"
        );

        lines.add("");

        lines.add(
                "Generated: " +
                LocalDateTime.now()
        );

        lines.add("");

        lines.add(
                "Total Passwords: " +
                list.size()
        );

        lines.add(
                "Strong Passwords: " +
                strong
        );

        lines.add(
                "Weak Passwords: " +
                weak
        );

        lines.add(
                "Expired Passwords: " +
                expired
        );

        return pdf(
                lines,
                "password-health-report.pdf"
        );
    }

    // =========================================================
    // USER ACTIVITY PDF
    // =========================================================

    @GetMapping(
            value = "/user-activity.pdf",
            produces = "application/pdf")
    public ResponseEntity<byte[]> userActivityPdf(
            Authentication authentication) {

        User user = currentUser(authentication);

        List<String> lines = new ArrayList<>();

        lines.add(
                "SECUREVAULT USER ACTIVITY REPORT"
        );

        lines.add("");

        lines.add(
                "Generated: " +
                LocalDateTime.now()
        );

        lines.add("");

        lines.add(
                "EVENT        STATUS        TIME"
        );

        lines.add(
                "------------------------------------------------------------"
        );

        for (SecurityEvent e :
                events.findTop10ByUserOrderByCreatedAtDesc(user)) {

            lines.add(
                    safe(e.getEventType()) +
                    "        " +
                    safe(e.getStatus()) +
                    "        " +
                    safe(String.valueOf(e.getCreatedAt()))
            );
        }

        return pdf(
                lines,
                "user-activity-report.pdf"
        );
    }

    // =========================================================
    // THREAT MONITORING PDF
    // =========================================================

    @GetMapping(
            value = "/threat-monitoring.pdf",
            produces = "application/pdf")
    public ResponseEntity<byte[]> threatMonitoringPdf(
            Authentication authentication) {

        User user = currentUser(authentication);

        List<String> lines = new ArrayList<>();

        lines.add(
                "SECUREVAULT THREAT MONITORING REPORT"
        );

        lines.add("");

        lines.add(
                "Generated: " +
                LocalDateTime.now()
        );

        lines.add("");

        lines.add(
                "EVENT        STATUS        RISK        TIME"
        );

        lines.add(
                "------------------------------------------------------------"
        );

        for (SecurityEvent e :
                events.findTop10ByUserOrderByCreatedAtDesc(user)) {

            if (e.getRiskLevel() != null &&
                    !"LOW".equalsIgnoreCase(
                            e.getRiskLevel())) {

                lines.add(
                        safe(e.getEventType()) +
                        "        " +
                        safe(e.getStatus()) +
                        "        " +
                        safe(e.getRiskLevel()) +
                        "        " +
                        safe(String.valueOf(e.getCreatedAt()))
                );
            }
        }

        if (lines.size() == 6) {
            lines.add(
                    "No medium or high risk events found."
            );
        }

        return pdf(
                lines,
                "threat-monitoring-report.pdf"
        );
    }

    // =========================================================
    // SECURITY DATA
    // =========================================================

    private List<List<String>> securityRows(
            User user) {

        return events
                .findTop10ByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(e -> List.of(
                        safe(e.getEventType()),
                        safe(e.getStatus()),
                        safe(e.getRiskLevel()),
                        safe(String.valueOf(
                                e.getCreatedAt()
                        ))
                ))
                .toList();
    }

    // =========================================================
    // EXCEL GENERATOR
    // =========================================================

    private ResponseEntity<byte[]> excel(
            String title,
            List<String> headers,
            List<List<String>> rows)
            throws Exception {

        try (
                Workbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream output =
                        new ByteArrayOutputStream()
        ) {

            Sheet sheet =
                    workbook.createSheet("Report");

            Row header =
                    sheet.createRow(0);

            for (int i = 0;
                 i < headers.size();
                 i++) {

                header
                        .createCell(i)
                        .setCellValue(
                                headers.get(i)
                        );
            }

            int rowNumber = 1;

            for (List<String> row : rows) {

                Row excelRow =
                        sheet.createRow(
                                rowNumber++
                        );

                for (int i = 0;
                     i < row.size();
                     i++) {

                    excelRow
                            .createCell(i)
                            .setCellValue(
                                    row.get(i)
                            );
                }
            }

            for (int i = 0;
                 i < headers.size();
                 i++) {

                sheet.autoSizeColumn(i);
            }

            workbook.write(output);

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" +
                            title
                                    .replace(" ", "-")
                                    .toLowerCase() +
                            ".xlsx"
                    )
                    .contentType(
                            MediaType.parseMediaType(
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            )
                    )
                    .body(
                            output.toByteArray()
                    );
        }
    }

    // =========================================================
    // PDF GENERATOR
    // =========================================================

    private ResponseEntity<byte[]> pdf(
            List<String> lines,
            String filename) {

        byte[] data =
                createPdf(lines);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" +
                        filename
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(data);
    }

    // =========================================================
    // SIMPLE MULTI-LINE PDF
    // =========================================================

    private byte[] createPdf(
            List<String> lines) {

        StringBuilder content =
                new StringBuilder();

        content.append("BT\n");
        content.append("/F1 11 Tf\n");
        content.append("50 750 Td\n");

        int lineCount = 0;

        for (String line : lines) {

            String safe =
                    safePdfText(line);

            content.append("(")
                    .append(safe)
                    .append(") Tj\n");

            content.append(
                    "0 -18 Td\n"
            );

            lineCount++;

            if (lineCount >= 36) {

                content.append("ET\n");

                break;
            }
        }

        content.append("ET");

        String stream =
                content.toString();

        String pdf =
                "%PDF-1.4\n" +

                "1 0 obj\n" +
                "<< /Type /Catalog /Pages 2 0 R >>\n" +
                "endobj\n" +

                "2 0 obj\n" +
                "<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n" +
                "endobj\n" +

                "3 0 obj\n" +
                "<< /Type /Page " +
                "/Parent 2 0 R " +
                "/MediaBox [0 0 612 792] " +
                "/Resources << " +
                "/Font << /F1 4 0 R >> " +
                ">> " +
                "/Contents 5 0 R >>\n" +
                "endobj\n" +

                "4 0 obj\n" +
                "<< /Type /Font " +
                "/Subtype /Type1 " +
                "/BaseFont /Helvetica >>\n" +
                "endobj\n" +

                "5 0 obj\n" +
                "<< /Length " +
                stream.getBytes(
                        StandardCharsets.US_ASCII
                ).length +
                " >>\n" +
                "stream\n" +
                stream +
                "\nendstream\n" +
                "endobj\n" +

                "xref\n" +
                "0 6\n" +
                "0000000000 65535 f \n" +

                "trailer\n" +
                "<< /Size 6 /Root 1 0 R >>\n" +

                "startxref\n" +
                "0\n" +

                "%%EOF";

        return pdf.getBytes(
                StandardCharsets.US_ASCII
        );
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private String safe(String value) {

        if (value == null) {
            return "N/A";
        }

        return value;
    }

    private String safePdfText(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("(", "\\(")
                .replace(")", "\\)");
    }
}
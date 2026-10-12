import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SecurityCenter.css";

const API = "http://localhost:8080";

const token = () => localStorage.getItem("token");

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(
      (await res.text()) || `Request failed (${res.status})`
    );
  }

  return res.json();
}

function SecurityCenter() {
  const navigate = useNavigate();

  const [range, setRange] = useState("7d");
  const [analytics, setAnalytics] = useState({});
  const [events, setEvents] = useState([]);
  const [devices, setDevices] = useState([]);

  const [notifications, setNotifications] = useState({
    items: [],
    unread: 0,
  });

  const [passwordHealth, setPasswordHealth] = useState({
    total: 0,
    strong: 0,
    weak: 0,
    reused: 0,
    expired: 0,
    healthPercent: 100,
  });

  const [mfa, setMfa] = useState(false);
  const [mfaSecret, setMfaSecret] = useState("");
  const [mfaCode, setMfaCode] = useState("");

  const [sessions, setSessions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const [
        a,
        e,
        d,
        n,
        m,
        s,
        p,
      ] = await Promise.all([
        api(`/api/security/analytics?range=${range}`),
        api(`/api/security/events?range=${range}`),
        api(`/api/security/devices`),
        api(`/api/security/notifications`),
        api(`/api/mfa/status`),
        api(`/api/sessions`),
        api(`/api/password-health`),
      ]);

      setAnalytics(a);
      setEvents(e);
      setDevices(d);
      setNotifications(n);
      setMfa(m.enabled);
      setSessions(s);
      setPasswordHealth(p);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [range]);

  const setupMfa = async () => {
    try {
      const d = await api("/api/mfa/setup", {
        method: "POST",
      });

      setMfaSecret(d.secret);
      setMfaCode(d.code);

      setMessage(
        "Scan/store the secret, then verify the displayed code."
      );
    } catch (e) {
      setMessage(e.message);
    }
  };

  const enableMfa = async () => {
    try {
      await api("/api/mfa/enable", {
        method: "POST",
        body: JSON.stringify({
          code: mfaCode,
        }),
      });

      setMfa(true);
      setMessage("MFA enabled successfully.");
    } catch (e) {
      setMessage(e.message);
    }
  };

  const disableMfa = async () => {
    try {
      await api("/api/mfa/disable", {
        method: "POST",
      });

      setMfa(false);
      setMfaSecret("");
      setMessage("MFA disabled.");
    } catch (e) {
      setMessage(e.message);
    }
  };

  const revoke = async (id) => {
    try {
      await api(`/api/sessions/${id}`, {
        method: "DELETE",
      });

      setSessions(
        sessions.filter((x) => x.id !== id)
      );
    } catch (e) {
      setMessage(e.message);
    }
  };

  const download = async (type) => {
    try {
      const response = await fetch(
        `${API}/api/reports/${type}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Report download failed (${response.status})`
        );
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = type;

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setMessage(`${type} downloaded successfully.`);
    } catch (error) {
      console.error("Report download error:", error);

      setMessage(
        error.message || "Failed to download report."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="security-layout">

        <aside className="security-sidebar">

          <div className="security-sidebar-brand">
            <div className="security-sidebar-logo">
              🔐
            </div>

            <div>
              <h1>SecureVault</h1>
              <p>Your passwords. Secured.</p>
            </div>
          </div>

          <div className="security-sidebar-menu">

            <button
              className="security-nav-button"
              onClick={() => navigate("/vault")}
            >
              <span>▣</span>
              My Vault
            </button>

            <button
              className="security-nav-button"
              onClick={() => navigate("/vault")}
            >
              <span>⇄</span>
              Shared With Me
            </button>

            <button
              className="security-nav-button"
              onClick={() => navigate("/vault")}
            >
              <span>↗</span>
              Shared By Me
            </button>

            <button
              className="security-nav-button"
              onClick={() => navigate("/vault")}
            >
              <span>👥</span>
              Team Vault
            </button>

            <button className="security-nav-button active">
              <span>🛡</span>
              Security Center
            </button>

            <button
              className="security-nav-button"
              onClick={() => navigate("/vault")}
            >
              <span>⊕</span>
              Add Credential
            </button>

            <button
              className="security-nav-button"
              onClick={handleLogout}
            >
              <span>↪</span>
              Logout
            </button>

          </div>

          <div className="security-sidebar-footer">

            <div className="security-footer-icon">
              🛡️
            </div>

            <h3>Vault Secure</h3>

            <p>
              Your data is encrypted
              <br />
              and protected
            </p>

            <div className="security-connection">
              <span>Secure Connection</span>
              <span className="security-connection-dot"></span>
            </div>

          </div>

        </aside>

        <main className="security-main">
          <div className="security-loading">
            Loading Security Center…
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="security-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="security-sidebar">

        <div className="security-sidebar-brand">

          <div className="security-sidebar-logo">
            🔐
          </div>

          <div>
            <h1>SecureVault</h1>
            <p>Your passwords. Secured.</p>
          </div>

        </div>

        <div className="security-sidebar-menu">

          <button
            className="security-nav-button"
            onClick={() => navigate("/vault")}
          >
            <span>▣</span>
            My Vault
          </button>

          <button
            className="security-nav-button"
            onClick={() => navigate("/vault")}
          >
            <span>⇄</span>
            Shared With Me
          </button>

          <button
            className="security-nav-button"
            onClick={() => navigate("/vault")}
          >
            <span>↗</span>
            Shared By Me
          </button>

          <button
            className="security-nav-button"
            onClick={() => navigate("/vault")}
          >
            <span>👥</span>
            Team Vault
          </button>

          <button className="security-nav-button active">
            <span>🛡</span>
            Security Center
          </button>

          <button
            className="security-nav-button"
            onClick={() => navigate("/vault")}
          >
            <span>⊕</span>
            Add Credential
          </button>

          <button
            className="security-nav-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

        <div className="security-sidebar-footer">

          <div className="security-footer-icon">
            🛡️
          </div>

          <h3>Vault Secure</h3>

          <p>
            Your data is encrypted
            <br />
            and protected
          </p>

          <div className="security-connection">
            <span>Secure Connection</span>
            <span className="security-connection-dot"></span>
          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="security-main">

        <header className="security-header">

          <div>
            <div className="security-eyebrow">
              SECURITY OPERATIONS
            </div>

            <h1>Security Center</h1>

            <p>
              Monitor authentication, devices, risk and account
              activity from one place.
            </p>
          </div>

          <div className="security-header-actions">

            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>

            <button
              className="security-primary-button"
              onClick={load}
            >
              ↻ Refresh
            </button>

          </div>

        </header>

        {message && (
          <div className="security-message">
            {message}
          </div>
        )}

        {/* =====================================================
            SECURITY METRICS
        ===================================================== */}

        <section className="metric-grid">

          <Metric
            label="Successful logins"
            value={analytics.successfulLogins ?? 0}
            icon="✓"
          />

          <Metric
            label="Failed logins"
            value={analytics.failedLogins ?? 0}
            icon="!"
            danger
          />

          <Metric
            label="Suspicious activity"
            value={analytics.suspiciousActivities ?? 0}
            icon="⌁"
            danger
          />

          <Metric
            label="Active alerts"
            value={analytics.activeAlerts ?? 0}
            icon="⚠"
          />

        </section>

        {/* =====================================================
            PASSWORD HEALTH
        ===================================================== */}

        <section className="security-panel password-health-panel">

          <div className="panel-heading">

            <div>
              <h2>Password Health</h2>

              <span>
                Monitor password strength, reuse and expiration
              </span>
            </div>

            <div className="password-health-score">
              <strong>
                {passwordHealth.healthPercent}%
              </strong>
              <span>Overall health</span>
            </div>

          </div>

          <div className="password-health-grid">

            <Metric
              label="Total passwords"
              value={passwordHealth.total}
              icon="🔐"
            />

            <Metric
              label="Strong passwords"
              value={passwordHealth.strong}
              icon="✓"
            />

            <Metric
              label="Weak passwords"
              value={passwordHealth.weak}
              icon="!"
              danger={passwordHealth.weak > 0}
            />

            <Metric
              label="Reused passwords"
              value={passwordHealth.reused}
              icon="↻"
              danger={passwordHealth.reused > 0}
            />

            <Metric
              label="Expired passwords"
              value={passwordHealth.expired}
              icon="⏰"
              danger={passwordHealth.expired > 0}
            />

          </div>

        </section>

        {/* =====================================================
            ACTIVITY + NOTIFICATIONS
        ===================================================== */}

        <div className="security-columns">

          <section className="security-panel wide">

            <div className="panel-heading">

              <div>
                <h2>Recent Security Activity</h2>

                <span>
                  Authentication and security events
                </span>
              </div>

            </div>

            <div className="event-list">

              {events.length === 0 ? (
                <Empty text="No security activity for this period." />
              ) : (
                events.map((e) => (

                  <div
                    className="event-row"
                    key={e.id}
                  >

                    <div
                      className={`event-icon ${
                        e.suspicious ? "risk" : ""
                      }`}
                    >
                      {e.suspicious ? "!" : "✓"}
                    </div>

                    <div className="event-main">

                      <strong>
                        {e.eventType}
                      </strong>

                      <span>
                        {e.details || e.status}
                      </span>

                    </div>

                    <div className="event-meta">

                      <b
                        className={
                          e.status === "FAILED"
                            ? "bad"
                            : "good"
                        }
                      >
                        {e.status}
                      </b>

                      <small>
                        {e.createdAt
                          ? new Date(
                              e.createdAt
                            ).toLocaleString()
                          : ""}
                      </small>

                    </div>

                  </div>

                ))
              )}

            </div>

          </section>

          <section className="security-panel">

            <div className="panel-heading">

              <div>
                <h2>Notifications</h2>

                <span>
                  {notifications.unread || 0} unread
                </span>
              </div>

            </div>

            <div className="notification-list">

              {notifications.items?.length ? (
                notifications.items
                  .slice(0, 6)
                  .map((n) => (

                    <div
                      className="notification"
                      key={n.id}
                    >

                      <div className="notification-title">
                        {n.title}
                      </div>

                      <p>{n.message}</p>

                      <small>
                        {new Date(
                          n.createdAt
                        ).toLocaleString()}
                      </small>

                    </div>

                  ))
              ) : (
                <Empty text="You're all caught up." />
              )}

            </div>

          </section>

        </div>

        {/* =====================================================
            DEVICES + MFA
        ===================================================== */}

        <div className="security-columns">

          <section className="security-panel">

            <div className="panel-heading">

              <div>
                <h2>Device Tracking</h2>

                <span>
                  Known login devices
                </span>
              </div>

            </div>

            <div className="device-list">

              {devices.length ? (
                devices.map((d) => (

                  <div
                    className="device-row"
                    key={d.id}
                  >

                    <div className="device-avatar">
                      ⌘
                    </div>

                    <div className="device-info">

                      <b>{d.name}</b>

                      <span>
                        {d.browser || "Browser"}
                      </span>

                      <small>
                        {d.ipAddress || "Unknown IP"} · Last
                        seen{" "}
                        {d.lastSeen
                          ? new Date(
                              d.lastSeen
                            ).toLocaleString()
                          : ""}
                      </small>

                    </div>

                  </div>

                ))
              ) : (
                <Empty text="No devices recorded yet." />
              )}

            </div>

          </section>

          <section className="security-panel">

            <div className="panel-heading">

              <div>
                <h2>Multi-Factor Authentication</h2>

                <span>
                  Protect your account with an additional factor
                </span>
              </div>

              <span
                className={`status-pill ${
                  mfa ? "on" : "off"
                }`}
              >
                {mfa ? "Enabled" : "Disabled"}
              </span>

            </div>

            {!mfa ? (
              <>
                <button
                  className="security-primary-button"
                  onClick={setupMfa}
                >
                  Set up MFA
                </button>

                {mfaSecret && (
                  <div className="mfa-box">

                    <label>Secret</label>

                    <code>{mfaSecret}</code>

                    <label>
                      Verification code
                    </label>

                    <input
                      value={mfaCode}
                      onChange={(e) =>
                        setMfaCode(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      maxLength={6}
                    />

                    <button
                      className="security-primary-button"
                      onClick={enableMfa}
                    >
                      Verify & Enable
                    </button>

                  </div>
                )}

              </>
            ) : (

              <button
                className="danger-btn"
                onClick={disableMfa}
              >
                Disable MFA
              </button>

            )}

          </section>

        </div>

        {/* =====================================================
            ACTIVE SESSIONS
        ===================================================== */}

        <section className="security-panel">

          <div className="panel-heading">

            <div>
              <h2>Active Sessions</h2>

              <span>
                Review and revoke signed-in sessions
              </span>
            </div>

          </div>

          <div className="session-list">

            {sessions.length ? (
              sessions.map((s) => (

                <div
                  className="session-row"
                  key={s.id}
                >

                  <div className="session-info">

                    <b>
                      {s.device || "Browser session"}
                    </b>

                    <span>
                      {s.browser || "Unknown browser"} ·{" "}
                      {s.ipAddress || "Unknown IP"}
                    </span>

                    <small>
                      Last seen{" "}
                      {s.lastSeen
                        ? new Date(
                            s.lastSeen
                          ).toLocaleString()
                        : ""}
                    </small>

                  </div>

                  <button
                    className="outline-btn"
                    onClick={() => revoke(s.id)}
                  >
                    Revoke
                  </button>

                </div>

              ))
            ) : (
              <Empty text="No active sessions." />
            )}

          </div>

        </section>

        {/* =====================================================
            REPORTS
        ===================================================== */}

        <section className="security-panel reports">

          <div className="panel-heading">

            <div>
              <h2>Security Reports</h2>

              <span>
                Export audit and security information
              </span>
            </div>

          </div>

          <div className="report-actions">

            <button
              className="report-button"
              onClick={() =>
                download("security.xlsx")
              }
            >
              Excel Security Report
            </button>

            <button
              className="report-button"
              onClick={() =>
                download("audit.xlsx")
              }
            >
              Excel Audit Report
            </button>

            <button
              className="report-button"
              onClick={() =>
                download("security.pdf")
              }
            >
              PDF Security Report
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

function Metric({
  label,
  value,
  icon,
  danger,
}) {
  return (
    <div className="metric-card">

      <div
        className={`metric-icon ${
          danger ? "danger" : ""
        }`}
      >
        {icon}
      </div>

      <div className="metric-content">

        <span>{label}</span>

        <strong>{value}</strong>

      </div>

    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="empty-security">
      {text}
    </div>
  );
}

export default SecurityCenter;
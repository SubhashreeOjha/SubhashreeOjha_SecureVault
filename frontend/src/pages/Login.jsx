import { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [mfa, setMfa] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setMsg("");
    setLoading(true);

    try {
      const endpoint = mfa
        ? "/api/auth/login/mfa"
        : "/api/auth/login";

      const body = mfa
        ? {
            email: email.trim(),
            password,
            code,
          }
        : {
            email: email.trim(),
            password,
          };

      const r = await fetch(
        `http://localhost:8080${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const text = await r.text();

      let d = {};

      try {
        d = JSON.parse(text);
      } catch {
        d = {
          message: text,
        };
      }

      if (!r.ok) {
        setMsg(
          d.message ||
            `Login failed (${r.status})`
        );
        return;
      }

      if (d.mfaRequired) {
        setMfa(true);
        setMsg(
          "Enter your 6-digit MFA code."
        );
        return;
      }

      if (!d.token) {
        setMsg(
          "Login response did not contain a token."
        );
        return;
      }

      localStorage.setItem(
        "token",
        d.token
      );

      window.location.href = "/vault";
    } catch (err) {
      console.error(err);

      setMsg(
        "Could not connect to SecureVault backend. Make sure it is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =================================================
          LEFT BRAND PANEL
          ================================================= */}

      <div className="login-brand-panel">

        <div className="login-brand-top">

          <div className="login-brand-logo">
            <span className="brand-lock">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  fill="#FACC15"
                />

                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>

          <div className="login-brand-title">
            SecureVault
          </div>

          <div className="login-brand-tagline">
            Your passwords. Secured.
          </div>

        </div>

        <div className="login-brand-content">

          <h2>
            Protect your digital
            <br />
            credentials.
          </h2>

          <p>
            Store, manage and securely share
            your credentials with confidence
            using SecureVault.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <span className="feature-check">✓</span>
              <span>
                Encrypted credential storage
              </span>
            </div>

            <div className="login-feature">
              <span className="feature-check">✓</span>
              <span>
                Secure authentication
              </span>
            </div>

            <div className="login-feature">
              <span className="feature-check">✓</span>
              <span>
                Controlled credential sharing
              </span>
            </div>

          </div>

        </div>

        <div className="login-secure-status">

          <span className="secure-status-dot"></span>

          <span>
            Secure connection
          </span>

        </div>

      </div>

      {/* =================================================
          RIGHT LOGIN PANEL
          ================================================= */}

      <div className="login-form-panel">

        <div className="login-card">

          {/* BRAND */}

          <div className="login-brand">

            <div className="login-logo">
              SV
            </div>

            <h1>
              SecureVault
            </h1>

            <p>
              Your passwords. Secured.
            </p>

          </div>

          {/* ERROR / INFO MESSAGE */}

          {msg && (
            <div className="login-message">
              {msg}
            </div>
          )}

          {/* LOGIN FORM */}

          <form
            className="login-form"
            onSubmit={submit}
          >

            {/* EMAIL */}

            <div className="login-field">

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="name@gmail.com"
                required
                disabled={
                  loading || mfa
                }
              />

            </div>

            {/* PASSWORD */}

            <div className="login-field">

              <label>
                Password
              </label>

              <div className="password-input-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter your password"
                  required
                  disabled={
                    loading || mfa
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={
                    loading || mfa
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (

                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >

                      <path
                        d="M3 3l18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      <path
                        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      <path
                        d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9.5 4 11 8-0.5 1.4-1.4 2.7-2.5 3.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M6.1 6.1C3.9 7.5 2.5 9.6 1 12c1.5 4 5.5 8 11 8 1.6 0 3.1-.3 4.4-.9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  ) : (

                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >

                      <path
                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />

                    </svg>

                  )}

                </button>

              </div>

            </div>

            {/* MFA CODE */}

            {mfa && (
              <div className="login-field">

                <label>
                  MFA Code
                </label>

                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="Enter 6-digit code"
                  required
                  disabled={loading}
                />

              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in…"
                : mfa
                ? "Verify & Login"
                : "Login"}
            </button>

          </form>

          {/* REGISTER */}

          <div className="login-register">

            Don't have an account?{" "}

            <a href="/register">
              Create one
            </a>

          </div>

          {/* RECOVERY */}

          <div className="login-register login-recovery">

            <a href="/recovery">
              Forgot password?
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
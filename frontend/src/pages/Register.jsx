import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const EyeIcon = ({ hidden = false }) => {
  if (hidden) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 3l18 18" />
        <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
        <path d="M9.88 4.24A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.5 6-.42.84-1.25 2.03-2.43 3.17" />
        <path d="M6.61 6.61C4.69 7.84 3.36 9.58 2.5 10.99 3.5 13 7 17 12 17c1.18 0 2.28-.2 3.29-.57" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
};

const LockIcon = () => (
  <svg
    viewBox="0 0 48 48"
    width="34"
    height="34"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="10"
      y="20"
      width="28"
      height="21"
      rx="5"
      fill="#f4b400"
    />
    <path
      d="M16 20v-6.5a8 8 0 0 1 16 0V20"
      stroke="#ffffff"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="24" cy="29.5" r="2.8" fill="#111827" />
    <path
      d="M24 32v4"
      stroke="#111827"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (value) => {
    if (!value) {
      return {
        score: 0,
        label: "",
      };
    }

    let score = 0;

    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score >= 5) {
      return {
        score,
        label: "Strong",
      };
    }

    if (score >= 3) {
      return {
        score,
        label: "Medium",
      };
    }

    return {
      score,
      label: "Weak",
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            password,
          }),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          responseText || "Registration failed. Please try again."
        );
      }

      setSuccess("Account created successfully. Redirecting to login...");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.message || "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* LEFT BRAND PANEL */}
      <section className="register-brand-panel">
        <div className="register-brand-content">

          <div className="register-brand-logo">
            <LockIcon />
          </div>

          <div className="register-brand-title">
            <h1>SecureVault</h1>
            <p>Your passwords. Secured.</p>
          </div>

          <div className="register-brand-message">
            <h2>Protect your digital credentials.</h2>

            <p>
              Store, manage and securely share your credentials
              with confidence using SecureVault.
            </p>

            <div className="register-security-list">

              <div className="register-security-item">
                <span className="register-check">✓</span>
                <span>Encrypted credential storage</span>
              </div>

              <div className="register-security-item">
                <span className="register-check">✓</span>
                <span>Secure authentication</span>
              </div>

              <div className="register-security-item">
                <span className="register-check">✓</span>
                <span>Controlled credential sharing</span>
              </div>

            </div>
          </div>

        </div>

        <div className="register-brand-footer">
          <span className="register-footer-dot"></span>
          Secure connection
        </div>
      </section>

      {/* REGISTER PANEL */}
      <section className="register-form-panel">

        <div className="register-card">

          <div className="register-card-header">

            <div className="register-mobile-logo">
              <LockIcon />
            </div>

            <h2>Create your account</h2>

            <p>
              Set up your SecureVault account to get started.
            </p>

          </div>

          <form onSubmit={handleRegister}>

            {/* NAME */}
            <div className="register-field">

              <label htmlFor="register-name">
                Full Name
              </label>

              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

            </div>

            {/* EMAIL */}
            <div className="register-field">

              <label htmlFor="register-email">
                Email Address
              </label>

              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                autoComplete="email"
                required
              />

            </div>

            {/* PASSWORD */}
            <div className="register-field">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-password-wrapper">

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <EyeIcon hidden={showPassword} />
                </button>

              </div>

              {password && (
                <div className="register-strength">

                  <div className="register-strength-header">
                    <span>Password strength</span>
                    <strong className={`strength-${passwordStrength.label.toLowerCase()}`}>
                      {passwordStrength.label}
                    </strong>
                  </div>

                  <div className="register-strength-bars">
                    {[1, 2, 3, 4, 5, 6].map((bar) => (
                      <span
                        key={bar}
                        className={
                          bar <= passwordStrength.score
                            ? `strength-bar active strength-${passwordStrength.label.toLowerCase()}`
                            : "strength-bar"
                        }
                      />
                    ))}
                  </div>

                </div>
              )}

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="register-field">

              <label htmlFor="register-confirm-password">
                Confirm Password
              </label>

              <div className="register-password-wrapper">

                <input
                  id="register-confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <EyeIcon hidden={showConfirmPassword} />
                </button>

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="register-message register-error">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="register-message register-success">
                {success}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <div className="register-login-link">
            Already have an account?
            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;
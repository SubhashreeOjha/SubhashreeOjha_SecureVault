import { useState } from "react";
import "./Recovery.css";

export default function Recovery() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [step, setStep] = useState(1);

  const request = async (e) => {
    e.preventDefault();

    const r = await fetch(
      "http://localhost:8080/api/auth/recovery/request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const d = await r.json();

    if (d.developmentToken) {
      setToken(d.developmentToken);
    }

    setMsg(
      "Recovery token generated. Use it below to set a new password."
    );

    setStep(2);
  };

  const reset = async (e) => {
    e.preventDefault();

    const r = await fetch(
      "http://localhost:8080/api/auth/recovery/reset",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );

    const d = await r.json();

    setMsg(d.message || "Done");

    if (r.ok) {
      setStep(1);
    }
  };

  return (
    <div className="recovery-page">
      <div className="recovery-card">
        <div className="recovery-brand">
          <div className="recovery-logo">
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="10" width="18" height="11" rx="2" />
              <path d="M7 10V7a5 5 0 0 1 10 0v3" />
              <path d="M12 14v3" />
            </svg>
          </div>

          <h1>Account Recovery</h1>
          <p>Securely restore access to your vault.</p>
        </div>

        {msg && (
          <div className="recovery-message">
            {msg}
          </div>
        )}

        {step === 1 ? (
          <form
            className="recovery-form"
            onSubmit={request}
          >
            <div className="recovery-field">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                placeholder="Your account email"
              />
            </div>

            <button
              type="submit"
              className="recovery-button"
            >
              Generate Recovery Token
            </button>
          </form>
        ) : (
          <form
            className="recovery-form"
            onSubmit={reset}
          >
            <div className="recovery-field">
              <label>Recovery Token</label>

              <input
                value={token}
                onChange={(e) =>
                  setToken(e.target.value)
                }
                required
              />
            </div>

            <div className="recovery-field">
              <label>New Password</label>

              <input
                type="password"
                minLength={8}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="recovery-button"
            >
              Reset Password
            </button>
          </form>
        )}

        <div className="recovery-back">
          <a href="/login">Back to login</a>
        </div>
      </div>
    </div>
  );
}
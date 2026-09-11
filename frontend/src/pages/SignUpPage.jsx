import React, { useState } from "react";
import { getApiErrorMessage, signupUser } from "../services/api";

export default function SignUpPage({ onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await signupUser({ name, email, password });
      setMessage("Account created successfully!");
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Failed to create account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join Pizza Point for fresh slice rewards</p>

        <input
          className="auth-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="auth-submit-btn" type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {onCancel && (
          <button className="auth-cancel-btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}

        {message && (
          <p className={`auth-message ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

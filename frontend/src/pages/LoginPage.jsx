import React, { useState } from "react";
import { getApiErrorMessage, loginUser } from "../services/api";

export default function LoginPage({ onSuccess, onCancel }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await loginUser({ email, password });
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      setMessage(data.message || "Login successful!");
      if (onSuccess) {
        onSuccess(data.user);
      }
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Log in to order your favorite pizza</p>

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
          {loading ? "Logging in..." : "Log In"}
        </button>

        {onCancel && (
          <button className="auth-cancel-btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}

        {message && (
          <p className={`auth-message ${message.includes("successful") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

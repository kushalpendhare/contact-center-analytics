import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      const response =
        await axios.post(
          "http://localhost:8001/auth/login",
          {
            email,
            password,
          }
        );

      const token =
        response.data
          .access_token;

      const payload =
        JSON.parse(
          atob(
            token.split(".")[1]
          )
        );

      login(token, {
        user_id:
          payload.user_id,
        organization_id:
          payload.organization_id,
        email:
          payload.email,
        role:
          payload.role,
      });

      navigate("/");
    } catch {
      setError(
        "Invalid Credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>
          Contact Center
          Analytics
        </h1>

        <p>
          Enterprise AI
          Insights Platform
        </p>

        {error && (
          <div
            className="error-box"
          >
            {error}
          </div>
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          onClick={submit}
          disabled={loading}
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
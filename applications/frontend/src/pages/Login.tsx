import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, saveSession } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const auth = mode === "login"
        ? await loginUser({ email, password })
        : await registerUser({
            email,
            password,
            full_name: fullName,
            tenant_name: tenantName,
          });

      saveSession(auth);
      navigate("/");
    } catch {
      setError("Unable to sign in. Check your details and try again.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Local workspace</p>
          <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>
          <p className="page-subtitle">
            Use a local account to keep projects isolated by workspace.
          </p>
        </div>

        <div className="segmented-control">
          <button
            className={mode === "login" ? "active" : ""}
            type="button"
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            type="button"
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {error && <div className="alert">{error}</div>}

        <form className="stack-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label>
                Full Name
                <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
              </label>

              <label>
                Workspace Name
                <input
                  value={tenantName}
                  onChange={(event) => setTenantName(event.target.value)}
                  placeholder="Acme Contact Center"
                  required
                />
              </label>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button className="button primary" type="submit">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;

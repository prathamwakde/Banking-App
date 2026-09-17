import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not sign in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Sign in</h1>
        <p className="auth-sub">Use the email and password you registered with.</p>

        {error && <p className="alert">{error}</p>}

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={change} required />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={change} required />
        </label>

        <button className="btn" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="auth-foot">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const empty = {
  name: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  referralId: "",
};

export default function Register() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    setBusy(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the account");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card wide" onSubmit={submit}>
        <h1>Open an account</h1>
        <p className="auth-sub">A referral ID is optional — add one if someone invited you.</p>

        {error && <p className="alert">{error}</p>}

        <div className="grid-2">
          <label>
            Name
            <input name="name" value={form.name} onChange={change} required />
          </label>
          <label>
            Mobile number
            <input name="mobile" value={form.mobile} onChange={change} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={change} required />
          </label>
          <label>
            Referral ID
            <input name="referralId" value={form.referralId} onChange={change} />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={change} required minLength={6} />
          </label>
          <label>
            Confirm password
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={change}
              required
            />
          </label>
        </div>

        <button className="btn" disabled={busy}>
          {busy ? "Creating…" : "Create account"}
        </button>

        <p className="auth-foot">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

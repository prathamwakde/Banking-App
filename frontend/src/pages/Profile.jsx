import { useState } from "react";
import api from "../api";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", mobile: user?.mobile || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.put("/user/profile", form);
      setMessage("Profile saved");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the profile");
    }
  };

  return (
    <Layout title="Profile">
      <form className="panel" onSubmit={save}>
        {message && <p className="notice">{message}</p>}
        {error && <p className="alert">{error}</p>}

        <label>
          Name
          <input name="name" value={form.name} onChange={change} />
        </label>
        <label>
          Mobile number
          <input name="mobile" value={form.mobile} onChange={change} />
        </label>
        <label>
          Email
          <input value={user?.email || ""} disabled />
        </label>
        <label>
          Referral ID
          <input value={user?.myReferralId || ""} disabled />
        </label>

        <button className="btn">Save changes</button>
      </form>
    </Layout>
  );
}

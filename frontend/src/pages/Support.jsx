import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout.jsx";

const empty = { subject: "", message: "", category: "other" };

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = () =>
    api
      .get("/support")
      .then((res) => setTickets(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load your tickets"));

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    try {
      await api.post("/support", form);
      setForm(empty);
      setNotice("Ticket sent. You will see a reply here.");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send the ticket");
    }
  };

  return (
    <Layout title="Support">
      {error && <p className="alert">{error}</p>}
      {notice && <p className="notice">{notice}</p>}

      <form className="panel" onSubmit={submit}>
        <label>
          Subject
          <input name="subject" value={form.subject} onChange={change} required />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={change}>
            <option value="payment">Payment</option>
            <option value="account">Account</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          What is happening?
          <textarea name="message" rows={4} value={form.message} onChange={change} required />
        </label>
        <button className="btn">Send ticket</button>
      </form>

      <h2 className="section-head">Your tickets</h2>
      {tickets.length === 0 ? (
        <p className="empty">You have not raised a ticket yet.</p>
      ) : (
        tickets.map((t) => (
          <article key={t._id} className="ticket">
            <header>
              <strong>{t.subject}</strong>
              <span className={`pill pill-${t.status}`}>{t.status}</span>
            </header>
            <p>{t.message}</p>
            {t.replies.map((r) => (
              <p key={r._id} className="ticket-reply">
                {r.message}
              </p>
            ))}
          </article>
        ))
      )}
    </Layout>
  );
}

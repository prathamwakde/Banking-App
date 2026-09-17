import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout.jsx";
import StatCard from "../components/StatCard.jsx";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function Wallet() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ amount: "", method: "upi", account: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = () =>
    api
      .get("/wallet")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load your wallet"));

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const activate = async () => {
    setError("");
    setNotice("");
    try {
      const { data: res } = await api.post("/wallet/activate");
      setNotice(`Account activated. Joining fee ${money(res.joinAmount)} recorded.`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not activate the account");
    }
  };

  const withdraw = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    try {
      await api.post("/wallet/withdraw", { ...form, amount: Number(form.amount) });
      setNotice("Withdrawal request sent. An admin will review it.");
      setForm({ amount: "", method: "upi", account: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send the request");
    }
  };

  if (!data) {
    return (
      <Layout title="Wallet">
        {error ? <p className="alert">{error}</p> : <p className="loading">Loading…</p>}
      </Layout>
    );
  }

  return (
    <Layout title="Wallet">
      {error && <p className="alert">{error}</p>}
      {notice && <p className="notice">{notice}</p>}

      <div className="stat-row">
        <StatCard label="Balance" value={money(data.balance)} tone="accent" />
        <StatCard label="Total income" value={money(data.totalIncome)} />
        <StatCard label="Withdrawal pending" value={money(data.pendingWithdrawal)} />
        <StatCard label="Available to withdraw" value={money(data.withdrawable)} />
      </div>

      {!data.isPaid && (
        <div className="panel wide-panel">
          <h2 className="section-head">Activate your account</h2>
          <p>
            Your account is not active yet. The joining fee is {money(data.joinAmount)}. Once it is
            recorded, your sponsors up to three levels above you receive their commission.
          </p>
          <button className="btn" onClick={activate}>
            Record joining fee
          </button>
        </div>
      )}

      <h2 className="section-head">Request a withdrawal</h2>
      <form className="panel" onSubmit={withdraw}>
        <label>
          Amount
          <input name="amount" type="number" min="100" value={form.amount} onChange={change} required />
        </label>
        <label>
          Method
          <select name="method" value={form.method} onChange={change}>
            <option value="upi">UPI</option>
            <option value="bank">Bank transfer</option>
          </select>
        </label>
        <label>
          {form.method === "upi" ? "UPI ID" : "Account number and IFSC"}
          <input name="account" value={form.account} onChange={change} required />
        </label>
        <button className="btn">Send request</button>
      </form>

      <h2 className="section-head">Payment history</h2>
      {data.payments.length === 0 ? (
        <p className="empty">No payments recorded yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Note</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.payments.map((p) => (
              <tr key={p._id}>
                <td>{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
                <td>{p.note}</td>
                <td>{p.type === "credit" ? "Credit" : "Debit"}</td>
                <td>{money(p.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="section-head">Withdrawal requests</h2>
      {data.withdrawals.length === 0 ? (
        <p className="empty">No withdrawal requests yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.withdrawals.map((w) => (
              <tr key={w._id}>
                <td>{new Date(w.createdAt).toLocaleDateString("en-IN")}</td>
                <td>{money(w.amount)}</td>
                <td>{w.method === "upi" ? "UPI" : "Bank"}</td>
                <td>
                  <span className={`pill pill-${w.status}`}>{w.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

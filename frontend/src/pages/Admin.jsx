import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout.jsx";
import StatCard from "../components/StatCard.jsx";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    Promise.all([
      api.get("/admin/overview"),
      api.get("/user/all"),
      api.get("/admin/withdrawals?status=pending"),
    ])
      .then(([o, m, w]) => {
        setStats(o.data);
        setMembers(m.data);
        setWithdrawals(w.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load the admin data"));

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (member) => {
    setError("");
    try {
      await api.put(`/admin/members/${member._id}/status`, {
        status: member.status === "active" ? "inactive" : "active",
      });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the member");
    }
  };

  const decide = async (id, status) => {
    setError("");
    try {
      await api.put(`/admin/withdrawals/${id}`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the request");
    }
  };

  return (
    <Layout title="Admin">
      {error && <p className="alert">{error}</p>}

      {stats && (
        <div className="stat-row">
          <StatCard label="Members" value={stats.totalMembers} tone="accent" />
          <StatCard label="Active" value={stats.activeMembers} />
          <StatCard label="Paid" value={stats.paidMembers} />
          <StatCard label="Open tickets" value={stats.openTickets} />
          <StatCard label="Withdrawals waiting" value={stats.pendingWithdrawals} />
          <StatCard label="Commission paid" value={money(stats.totalPaidOut)} />
        </div>
      )}

      <h2 className="section-head">Withdrawal requests waiting</h2>
      {withdrawals.length === 0 ? (
        <p className="empty">Nothing waiting for review.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Amount</th>
              <th>Pay to</th>
              <th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w._id}>
                <td>{w.user?.name}</td>
                <td>{money(w.amount)}</td>
                <td>{w.account}</td>
                <td className="row-actions">
                  <button className="btn small" onClick={() => decide(w._id, "approved")}>
                    Approve
                  </button>
                  <button className="btn small ghost" onClick={() => decide(w._id, "rejected")}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="section-head">Members</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Referral ID</th>
            <th>Balance</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.myReferralId}</td>
              <td>{money(m.balance)}</td>
              <td>
                <span className={`pill pill-${m.status}`}>{m.status}</span>
              </td>
              <td>
                <button className="btn small ghost" onClick={() => toggleStatus(m)}>
                  {m.status === "active" ? "Make inactive" : "Make active"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

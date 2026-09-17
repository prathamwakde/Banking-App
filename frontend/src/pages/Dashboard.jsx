import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout.jsx";
import StatCard from "../components/StatCard.jsx";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/user/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load your dashboard"));
  }, []);

  if (error) return <Layout title="Home"><p className="alert">{error}</p></Layout>;
  if (!data) return <Layout title="Home"><p className="loading">Loading…</p></Layout>;

  const { profile, members, levels, referrals, income } = data;

  return (
    <Layout title={`Welcome, ${profile.name}`}>
      <section className="balance-strip">
        <div>
          <p className="balance-label">GroupGain balance</p>
          <p className="balance-value">₹{profile.balance.toLocaleString("en-IN")}</p>
        </div>
        <div className="referral-chip">
          <span>Your referral ID</span>
          <strong>{profile.referralId}</strong>
        </div>
      </section>

      <h2 className="section-head">Members</h2>
      <div className="stat-row">
        <StatCard label="Total members" value={members.totalMember} tone="accent" />
        <StatCard label="Active" value={members.activeMember} />
        <StatCard label="Inactive" value={members.inactiveMember} />
        <StatCard label="Paid" value={members.paidMember} />
      </div>

      <h2 className="section-head">Levels</h2>
      <div className="stat-row">
        <StatCard label="Level 1" value={levels.active1} />
        <StatCard label="Level 2" value={levels.active2} />
        <StatCard label="Level 3+" value={levels.active3} />
      </div>

      <h2 className="section-head">Referrals</h2>
      <div className="stat-row">
        <StatCard label="Direct members" value={referrals.directMember} />
        <StatCard label="Level profit" value={`₹${referrals.levelProfit}`} />
        <StatCard label="Paid referrals" value={referrals.paidReferrals} />
        <StatCard label="Unpaid referrals" value={referrals.unpaidReferrals} />
      </div>

      <h2 className="section-head">Income</h2>
      <div className="stat-row">
        <StatCard label="Total income" value={`₹${income.totalIncome}`} tone="accent" />
        <StatCard label="My team" value={income.myTeam} />
      </div>
    </Layout>
  );
}

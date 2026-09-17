import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout.jsx";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function Reports() {
  const [income, setIncome] = useState([]);
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/report/income?months=6"), api.get("/report/levels")])
      .then(([i, l]) => {
        setIncome(i.data);
        setLevels(l.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load the reports"));
  }, []);

  const peak = Math.max(1, ...income.map((r) => r.total));

  return (
    <Layout title="Reports">
      {error && <p className="alert">{error}</p>}

      <h2 className="section-head">Income, last six months</h2>
      {income.length === 0 ? (
        <p className="empty">No income recorded in this period yet.</p>
      ) : (
        <div className="panel wide-panel">
          {income.map((row) => (
            <div key={row.period} className="bar-row">
              <span className="bar-label">{row.period}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${(row.total / peak) * 100}%` }} />
              </span>
              <span className="bar-value">{money(row.total)}</span>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-head">Members by level</h2>
      {levels.length === 0 ? (
        <p className="empty">No members below you yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Members</th>
              <th>Paid</th>
              <th>Unpaid</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((l) => (
              <tr key={l.level}>
                <td>Level {l.level}</td>
                <td>{l.members}</td>
                <td>{l.paid}</td>
                <td>{l.members - l.paid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

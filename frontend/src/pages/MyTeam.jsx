import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout.jsx";

export default function MyTeam() {
  const [team, setTeam] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/user/team")
      .then((res) => setTeam(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load your team"));
  }, []);

  return (
    <Layout title="My team">
      {error && <p className="alert">{error}</p>}

      {!error && team.length === 0 && (
        <p className="empty">No one has joined with your referral ID yet. Share it to start building your team.</p>
      )}

      {team.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Level</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {team.map((m) => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.mobile}</td>
                <td>{m.level}</td>
                <td>
                  <span className={`pill pill-${m.status}`}>{m.status}</span>
                </td>
                <td>{m.isPaid ? "Paid" : "Unpaid"}</td>
                <td>{new Date(m.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

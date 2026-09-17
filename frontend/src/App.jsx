import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyTeam from "./pages/MyTeam.jsx";
import Profile from "./pages/Profile.jsx";
import Wallet from "./pages/Wallet.jsx";
import Reports from "./pages/Reports.jsx";
import Support from "./pages/Support.jsx";
import Help from "./pages/Help.jsx";
import Admin from "./pages/Admin.jsx";

const Private = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Private><Dashboard /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      <Route path="/wallet" element={<Private><Wallet /></Private>} />
      <Route path="/team" element={<Private><MyTeam /></Private>} />
      <Route path="/reports" element={<Private><Reports /></Private>} />
      <Route path="/support" element={<Private><Support /></Private>} />
      <Route path="/help" element={<Private><Help /></Private>} />
      <Route path="/admin" element={<Private adminOnly><Admin /></Private>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

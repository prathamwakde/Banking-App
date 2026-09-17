import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "Profile" },
  { to: "/wallet", label: "Wallet" },
  { to: "/team", label: "My team" },
  { to: "/reports", label: "Reports" },
  { to: "/support", label: "Support" },
  { to: "/help", label: "Help" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">GG</span>
        <span>GroupGain</span>
      </div>

      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end className="nav-link">
            {l.label}
          </NavLink>
        ))}
        {user?.role === "admin" && (
          <NavLink to="/admin" className="nav-link">
            Admin
          </NavLink>
        )}
      </nav>

      <div className="sidebar-foot">
        <p className="sidebar-name">{user?.name}</p>
        <p className="sidebar-id">ID {user?.myReferralId}</p>
        <button
          className="btn-ghost"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

import { NavLink } from "react-router-dom";
import { clearSession, getStoredUser } from "../services/authService";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/uploads", label: "Uploads" },
  { to: "/reports", label: "Reports" },
  { to: "/settings", label: "Settings" },
];

function Sidebar() {
  const user = getStoredUser();

  const handleSignOut = () => {
    clearSession();
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">CC</span>
        <div>
          <strong>CC Platform</strong>
          <span>Engineering Ops</span>
        </div>
      </div>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            end={link.to === "/"}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>{user?.tenant.name ?? "Local Workspace"}</span>
        <strong>{user?.full_name ?? "Local User"}</strong>
        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

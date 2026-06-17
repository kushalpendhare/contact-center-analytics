import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/uploads", label: "Uploads" },
  { to: "/reports", label: "Reports" },
  { to: "/settings", label: "Settings" },
];

function Sidebar() {
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
    </aside>
  );
}

export default Sidebar;

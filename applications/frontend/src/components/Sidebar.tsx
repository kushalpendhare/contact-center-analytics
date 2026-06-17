import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#1f2937",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>CC Platform</h2>

      <nav>
        <p><Link to="/">Dashboard</Link></p>
        <p><Link to="/projects">Projects</Link></p>
        <p><Link to="/uploads">Uploads</Link></p>
        <p><Link to="/reports">Reports</Link></p>
        <p><Link to="/settings">Settings</Link></p>
      </nav>
    </div>
  );
}

export default Sidebar;
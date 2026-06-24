import {
  Link,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const location =
    useLocation();

  const { user, logout } =
    useAuth();

  const superAdminMenu = [
    {
      name: "Admin Dashboard",
      path: "/",
    },
    {
      name: "Organizations",
      path: "/organizations",
    },
    {
      name: "Users",
      path: "/users",
    },
    {
      name: "Subscriptions",
      path: "/subscriptions",
    },
  ];

  const orgMenu = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Calls",
      path: "/calls",
    },
    {
      name: "Analytics",
      path: "/analytics",
    },
    {
      name: "Upload",
      path: "/upload",
    },
  ];

  const menu =
    user?.role ===
    "SUPER_ADMIN"
      ? superAdminMenu
      : orgMenu;

  return (
    <div
      style={{
        width: "280px",
        background:
          "#F59E0B",
        color: "white",
        padding:
          "30px 20px",
      }}
    >
      <h2>
        CCA SaaS
      </h2>

      <div
        style={{
          marginBottom:
            "30px",
          padding:
            "15px",
          background:
            "rgba(255,255,255,0.15)",
          borderRadius:
            "12px",
        }}
      >
        <div>
          {user?.email}
        </div>

        <small>
          {user?.role}
        </small>
      </div>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display:
              "block",
            padding:
              "14px",
            marginBottom:
              "10px",
            textDecoration:
              "none",
            color: "white",
            borderRadius:
              "10px",
            background:
              location.pathname ===
              item.path
                ? "#D97706"
                : "transparent",
          }}
        >
          {item.name}
        </Link>
      ))}

      <button
        style={{
          width: "100%",
          marginTop:
            "30px",
        }}
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
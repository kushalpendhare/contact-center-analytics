import { useAuth } from "../context/AuthContext";

function Header() {
  const { user } =
    useAuth();

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#f59e0b,#d97706)",
        color: "white",
        padding: "24px",
        borderRadius:
          "16px",
        marginBottom:
          "25px",
      }}
    >
      <h1
        style={{
          margin: 0,
        }}
      >
        Contact Center
        Analytics
      </h1>

      <p>
        AI Powered Customer
        Intelligence
      </p>

      <div>
        Logged in as:
        {" "}
        {user?.email}
      </div>
    </div>
  );
}

export default Header;
import Header from "../components/Header";

function SuperAdminDashboard() {
  return (
    <>
      <Header />

      <h1>Super Admin Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div className="card">
          <h3>Organizations</h3>
          <h1>--</h1>
        </div>

        <div className="card">
          <h3>Users</h3>
          <h1>--</h1>
        </div>

        <div className="card">
          <h3>Subscriptions</h3>
          <h1>--</h1>
        </div>

        <div className="card">
          <h3>Revenue</h3>
          <h1>$0</h1>
        </div>
      </div>
    </>
  );
}

export default SuperAdminDashboard;
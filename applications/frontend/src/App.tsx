import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Calls from "./pages/Calls";
import Analytics from "./pages/Analytics";
import Upload from "./pages/Upload";
import CallDetails from "./pages/CallDetails";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Organizations from "./pages/Organizations";
import Users from "./pages/Users";
import Subscriptions from "./pages/Subscriptions";

function App() {
  const { token, user } =
    useAuth();

  if (!token) {
    return (
      <Routes>
        <Route
          path="*"
          element={<Login />}
        />
      </Routes>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "#FFF9EC",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <Routes>
          {/* SUPER ADMIN */}

          {user?.role ===
            "SUPER_ADMIN" && (
            <>
              <Route
                path="/"
                element={
                  <SuperAdminDashboard />
                }
              />

              <Route
                path="/organizations"
                element={
                  <Organizations />
                }
              />

              <Route
                path="/users"
                element={
                  <Users />
                }
              />

              <Route
                path="/subscriptions"
                element={
                  <Subscriptions />
                }
              />
            </>
          )}

          {/* ORG ADMIN */}

          {user?.role !==
            "SUPER_ADMIN" && (
            <>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/calls"
                element={
                  <ProtectedRoute>
                    <Calls />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/calls/:id"
                element={
                  <ProtectedRoute>
                    <CallDetails />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          <Route
            path="/login"
            element={<Login />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
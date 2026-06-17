import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAccessToken, getCurrentUser, clearSession } from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProjectDetails from "./pages/ProjectDetails";
import Projects from "./pages/Projects";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Uploads from "./pages/Uploads";
import Recordings from "./pages/Recordings";
import RecordingDetailPage from "./pages/RecordingAnalysis";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();

    if (!token) return;

    getCurrentUser().catch(() => {
      clearSession();
      navigate("/login");
    });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
      <Route path="/projects/:projectId/recordings" element={<ProtectedRoute><Recordings /></ProtectedRoute>} />
      <Route path="/projects/:projectId/recordings/:recordingId" element={<ProtectedRoute><RecordingDetailPage /></ProtectedRoute>} />
      <Route path="/uploads" element={<ProtectedRoute><Uploads /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

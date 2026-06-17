import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getRecordings, uploadRecording, deleteRecording, getRecordingStats } from "../services/recordingService";
import type { Recording, RecordingStats } from "../services/recordingService";

function Recordings() {
  const { projectId } = useParams();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [stats, setStats] = useState<RecordingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const projectIdNum = projectId ? parseInt(projectId, 10) : 0;

  const loadRecordings = useCallback(async () => {
    if (!projectIdNum) return;
    setLoading(true);
    try {
      const [recordingsData, statsData] = await Promise.all([
        getRecordings(projectIdNum),
        getRecordingStats(projectIdNum),
      ]);
      setRecordings(recordingsData);
      setStats(statsData);
      setError("");
    } catch {
      setError("Unable to load recordings. Check that the API is running.");
    } finally {
      setLoading(false);
    }
  }, [projectIdNum]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecordings();
  }, [loadRecordings]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!projectIdNum || e.dataTransfer.files.length === 0) {
      return;
    }

    const file = e.dataTransfer.files[0];
    await handleFileUpload(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!projectIdNum || !e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    await handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      await uploadRecording(projectIdNum, file);
      await loadRecordings();
    } catch {
      setError("Upload failed. Check file size and API connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (recordingId: number) => {
    const confirmed = window.confirm("Delete this recording?");
    if (!confirmed) return;

    try {
      await deleteRecording(projectIdNum, recordingId);
      await loadRecordings();
    } catch {
      setError("Unable to delete recording.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#15803d";
      case "processing":
        return "#ea580c";
      case "failed":
        return "#dc2626";
      default:
        return "#2563eb";
    }
  };

  return (
    <MainLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Project Recordings</p>
          <h1>Call Recordings</h1>
          <p className="page-subtitle">
            Upload and analyze call recordings for this project.
          </p>
        </div>
        <Link className="button secondary" to={`/projects/${projectId}`}>
          Back to Project
        </Link>
      </section>

      {error && <div className="alert">{error}</div>}

      <section className="panel">
        <h2>Recording Statistics</h2>
        <div className="metric-grid">
          <div className="metric-card">
            <span>Total Recordings</span>
            <strong>{stats?.total_recordings ?? "-"}</strong>
          </div>
          <div className="metric-card">
            <span>Analyzed</span>
            <strong>{stats?.analyzed_recordings ?? "-"}</strong>
          </div>
          <div className="metric-card">
            <span>Avg Agent Score</span>
            <strong>{stats?.average_agent_score.toFixed(1) ?? "-"}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Upload Recording</h2>
        <div
          className={`upload-zone ${dragActive ? "active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <p className="upload-icon">📁</p>
            <p className="upload-text">Drag and drop your recording here</p>
            <p className="upload-subtext">or</p>
            <label className="button primary">
              Select File
              <input
                type="file"
                accept="audio/*,video/*"
                onChange={handleFileSelect}
                disabled={uploading}
                style={{ display: "none" }}
              />
            </label>
            <p className="upload-subtext">Supports MP3, WAV, M4A, and video formats</p>
          </div>
        </div>
        {uploading && <p className="upload-status">Uploading...</p>}
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Recordings</h2>
          <span>{recordings.length} total</span>
        </div>

        {loading ? (
          <p>Loading recordings...</p>
        ) : recordings.length === 0 ? (
          <p className="muted">No recordings yet. Upload one to get started.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recordings.map((recording) => (
                  <tr key={recording.id}>
                    <td>
                      <Link to={`/projects/${projectId}/recordings/${recording.id}`}>
                        {recording.name}
                      </Link>
                    </td>
                    <td>
                      <span
                        style={{
                          color: getStatusColor(recording.status),
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      >
                        {recording.status}
                      </span>
                    </td>
                    <td>{recording.duration_seconds ? `${recording.duration_seconds.toFixed(1)}s` : "-"}</td>
                    <td>{new Date(recording.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="button danger"
                        onClick={() => handleDelete(recording.id)}
                        style={{ fontSize: "12px", padding: "6px 10px" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default Recordings;

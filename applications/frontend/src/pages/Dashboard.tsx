import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  getDashboardSummary,
  getSystemHealth,
} from "../services/projectService";
import type { DashboardSummary, HealthStatus } from "../services/projectService";

function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([getDashboardSummary(), getSystemHealth()])
      .then(([summaryData, healthData]) => {
        setSummary(summaryData);
        setHealth(healthData);
        setError("");
      })
      .catch(() => {
        setError("Unable to load dashboard data. Check that the API is running.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Operations workspace</p>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            Monitor the local platform and continue work from recent projects.
          </p>
        </div>

        <Link className="button primary" to="/projects">
          New Project
        </Link>
      </section>

      {error && <div className="alert">{error}</div>}
      {loading && <div className="alert">Loading dashboard...</div>}

      <section className="metric-grid">
        <div className="metric-card">
          <span>Total Projects</span>
          <strong>{summary?.project_count ?? "-"}</strong>
        </div>
        <div className="metric-card">
          <span>Database</span>
          <strong className={health?.database === "healthy" ? "good" : "bad"}>
            {health?.database ?? "-"}
          </strong>
        </div>
        <div className="metric-card">
          <span>Redis Cache</span>
          <strong className={health?.redis === "healthy" ? "good" : "bad"}>
            {health?.redis ?? "-"}
          </strong>
        </div>
        <div className="metric-card">
          <span>Summary Cache</span>
          <strong>{summary?.cached ? "hit" : "fresh"}</strong>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="section-title">
            <h2>Recent Projects</h2>
            <Link to="/projects">View all</Link>
          </div>

          <div className="list">
            {summary?.recent_projects.length ? (
              summary.recent_projects.map((project) => (
                <Link className="list-row" to={`/projects/${project.id}`} key={project.id}>
                  <span>
                    <strong>{project.name}</strong>
                    <small>{project.customer}</small>
                  </span>
                  <em>{project.platform}</em>
                </Link>
              ))
            ) : (
              <p className="muted">No projects yet. Create one to start the workspace.</p>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Platforms</h2>
          </div>

          <div className="list">
            {summary && Object.keys(summary.platform_counts).length > 0 ? (
              Object.entries(summary.platform_counts).map(([platform, count]) => (
                <div className="list-row" key={platform}>
                  <span>
                    <strong>{platform}</strong>
                    <small>{count} project{count === 1 ? "" : "s"}</small>
                  </span>
                </div>
              ))
            ) : (
              <p className="muted">Platform distribution will appear after projects are added.</p>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Dashboard;

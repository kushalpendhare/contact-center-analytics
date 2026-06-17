import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  deleteProject,
  getProject,
  updateProject,
} from "../services/projectService";
import type { Project } from "../services/projectService";

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("");
  const [customer, setCustomer] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) {
      return;
    }

    getProject(projectId)
      .then((data) => {
        setProject(data);
        setName(data.name);
        setPlatform(data.platform);
        setCustomer(data.customer);
      })
      .catch(() => {
        setError("Project not found or API is unavailable.");
      });
  }, [projectId]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    if (!project) {
      return;
    }

    try {
      const updatedProject = await updateProject(project.id, {
        name,
        platform,
        customer,
      });

      setProject(updatedProject);
      setMessage("Project updated.");
      setError("");
    } catch {
      setError("Unable to update project.");
    }
  };

  const handleDelete = async () => {
    if (!project) {
      return;
    }

    const confirmed = window.confirm("Delete this project?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(project.id);
      navigate("/projects");
    } catch {
      setError("Unable to delete project.");
    }
  };

  return (
    <MainLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Project workspace</p>
          <h1>{project?.name ?? "Project Details"}</h1>
          <p className="page-subtitle">
            Manage project metadata and prepare project-specific analysis modules.
          </p>
        </div>

        <Link className="button secondary" to="/projects">
          Back to Projects
        </Link>
      </section>

      {message && <div className="success">{message}</div>}
      {error && <div className="alert">{error}</div>}

      {project && (
        <section className="content-grid">
          <div className="panel">
            <h2>Project Profile</h2>

            <form className="stack-form" onSubmit={handleSave}>
              <label>
                Project Name
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>

              <label>
                Platform
                <input
                  value={platform}
                  onChange={(event) => setPlatform(event.target.value)}
                  required
                />
              </label>

              <label>
                Customer
                <input
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  required
                />
              </label>

              <div className="button-row">
                <button className="button primary" type="submit">
                  Save Changes
                </button>
                <button className="button danger" type="button" onClick={handleDelete}>
                  Delete Project
                </button>
              </div>
            </form>
          </div>

          <div className="panel">
            <h2>Project Modules</h2>

            <div className="module-grid">
              <div className="module-tile">
                <strong>SIP Analysis</strong>
                <span>Attach traces and troubleshoot signaling flows.</span>
              </div>
              <div className="module-tile">
                <strong>Recordings</strong>
                <span>Review audio and transcripts for this project.</span>
              </div>
              <div className="module-tile">
                <strong>AI Analysis</strong>
                <span>Generate summaries, checks, and recommendations.</span>
              </div>
              <div className="module-tile">
                <strong>Reports</strong>
                <span>Build customer-ready outputs from project data.</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}

export default ProjectDetails;

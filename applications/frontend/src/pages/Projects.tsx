import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { getProjects, createProject } from "../services/projectService";
import type { Project } from "../services/projectService";
import MainLayout from "../layouts/MainLayout";

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("");
  const [customer, setCustomer] = useState("");
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      setError("");
    } catch {
      setError("Unable to load projects. Check that the API is running.");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await createProject({
        name,
        platform,
        customer,
      });

      setName("");
      setPlatform("");
      setCustomer("");

      loadProjects();
    } catch {
      setError("Unable to create project. Check the form and API connection.");
    }
  };

  return (
    <MainLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Customer workspaces</p>
          <h1>Projects</h1>
          <p className="page-subtitle">
            Create and manage the contact center initiatives your teams are working on.
          </p>
        </div>
      </section>

      {error && <div className="alert">{error}</div>}

      <section className="panel">
        <h2>Create Project</h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Project Name
            <input
              placeholder="IVR Migration"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Platform
            <input
              placeholder="Genesys Cloud"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              required
            />
          </label>

          <label>
            Customer
            <input
              placeholder="Acme Corp"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
            />
          </label>

          <button className="button primary" type="submit">
            Create Project
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>All Projects</h2>
          <span>{projects.length} total</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Platform</th>
                <th>Customer</th>
                <th>ID</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link to={`/projects/${project.id}`}>{project.name}</Link>
                  </td>
                  <td>{project.platform}</td>
                  <td>{project.customer}</td>
                  <td>{project.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </MainLayout>
  );
}

export default Projects;

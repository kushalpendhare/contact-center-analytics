import { useEffect, useState } from "react";
import { getProjects, createProject } from "../services/projectService";

function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("");
  const [customer, setCustomer] = useState("");

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createProject({
      name,
      platform,
      customer,
    });

    setName("");
    setPlatform("");
    setCustomer("");

    loadProjects();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Projects</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />

        <input
          placeholder="Customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />

        <button type="submit">
          Create Project
        </button>
      </form>

      <hr />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Platform</th>
            <th>Customer</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.platform}</td>
              <td>{project.customer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Projects;
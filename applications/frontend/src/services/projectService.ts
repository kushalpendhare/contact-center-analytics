// src/services/projectService.ts

const API_URL = "http://localhost:8000";

export async function getProjects() {
  const response = await fetch(`${API_URL}/projects`);
  return response.json();
}

export async function createProject(project: {
  name: string;
  platform: string;
  customer: string;
}) {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });

  return response.json();
}
// src/services/projectService.ts

import { getAccessToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type Project = {
  id: number;
  name: string;
  platform: string;
  customer: string;
  tenant_id: number;
};

export type ProjectInput = {
  name: string;
  platform: string;
  customer: string;
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options?.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getProjects() {
  return request<Project[]>(`${API_URL}/projects`);
}

export async function getProject(projectId: string) {
  return request<Project>(`${API_URL}/projects/${projectId}`);
}

export async function createProject(project: ProjectInput) {
  return request<Project>(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
}

export async function updateProject(projectId: number, project: ProjectInput) {
  return request<Project>(`${API_URL}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
}

export async function deleteProject(projectId: number) {
  return request<Project>(`${API_URL}/projects/${projectId}`, {
    method: "DELETE",
  });
}

export type HealthStatus = {
  status: string;
  database: string;
  redis: string;
};

export async function getSystemHealth() {
  return request<HealthStatus>(`${API_URL}/health`);
}

export type DashboardSummary = {
  project_count: number;
  platform_counts: Record<string, number>;
  recent_projects: Project[];
  cached: boolean;
};

export async function getDashboardSummary() {
  return request<DashboardSummary>(`${API_URL}/dashboard/summary`);
}

// src/services/recordingService.ts

import { getAccessToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type Recording = {
  id: number;
  project_id: number;
  name: string;
  duration_seconds: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type RecordingTranscript = {
  id: number;
  recording_id: number;
  text: string;
  source: string;
  created_at: string;
};

export type ComplianceFlags = {
  pii_detected: boolean;
  regulatory_issues: string[];
};

export type AnalysisMetadata = {
  model: string;
  tokens: number;
  cost: number;
  timestamp: string;
};

export type RecordingAnalysis = {
  id: number;
  recording_id: number;
  summary: string;
  sentiment: string;
  agent_score: number;
  compliance_flags: ComplianceFlags;
  keywords: string[];
  analysis_metadata: AnalysisMetadata;
  created_at: string;
};

export type RecordingDetail = {
  recording: Recording;
  transcript: RecordingTranscript | null;
  analysis: RecordingAnalysis | null;
};

export type RecordingStats = {
  total_recordings: number;
  analyzed_recordings: number;
  average_agent_score: number;
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

export async function uploadRecording(projectId: number, file: File): Promise<Recording> {
  const formData = new FormData();
  formData.append("file", file);

  const token = getAccessToken();
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}/projects/${projectId}/recordings`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  return response.json();
}

export async function getRecordings(projectId: number): Promise<Recording[]> {
  return request<Recording[]>(`${API_URL}/projects/${projectId}/recordings`);
}

export async function getRecordingDetail(projectId: number, recordingId: number): Promise<RecordingDetail> {
  return request<RecordingDetail>(`${API_URL}/projects/${projectId}/recordings/${recordingId}`);
}

export async function analyzeRecording(projectId: number, recordingId: number): Promise<RecordingAnalysis> {
  return request<RecordingAnalysis>(`${API_URL}/projects/${projectId}/recordings/${recordingId}/analyze`, {
    method: "POST",
  });
}

export async function deleteRecording(projectId: number, recordingId: number): Promise<Recording> {
  return request<Recording>(`${API_URL}/projects/${projectId}/recordings/${recordingId}`, {
    method: "DELETE",
  });
}

export async function getRecordingStats(projectId: number): Promise<RecordingStats> {
  return request<RecordingStats>(`${API_URL}/projects/${projectId}/recordings/stats`);
}

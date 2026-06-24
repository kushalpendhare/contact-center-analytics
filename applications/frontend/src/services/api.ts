import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const authApi = axios.create({
  baseURL: "http://localhost:8001",
});

authApi.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export const getCallById = (
  id: string
) =>
  api.get(
    `/calls/${id}`
  );

export const getTranscriptByCallId =
  (id: string) =>
    api.get(
      `/transcripts/${id}`
    );
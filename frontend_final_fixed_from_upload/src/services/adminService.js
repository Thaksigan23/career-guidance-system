import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const fetchUsers = () => API.get("/users");
export const updateUserRole = (id, role) =>
  API.put(`/users/${id}/status`, { role });

export const fetchJobs = () => API.get("/jobs");
export const approveJob = (id) => API.put(`/jobs/${id}/approve`);
export const rejectJob = (id) => API.put(`/jobs/${id}/reject`);

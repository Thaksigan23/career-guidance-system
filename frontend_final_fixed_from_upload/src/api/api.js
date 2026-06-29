import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===========================
   SAVED JOBS
=========================== */
export const getSavedJobs = async () => {
  const res = await API.get("/saved");
  return res.data;
};

export const saveJob = async (job_id) => {
  const res = await API.post("/saved", { job_id });
  return res.data;
};

export const removeSavedJob = async (saved_id) => {
  const res = await API.delete(`/saved/${saved_id}`);
  return res.data;
};

/* ===========================
   APPLICATIONS
=========================== */
export const applyJob = async (job_id, message = "") => {
  const res = await API.post("/applications/apply", {
    job_id,
    message,
  });
  return res.data;
};

/* ===========================
   RECOMMENDATIONS
=========================== */
export const getRecommendations = async () => {
  const res = await API.get("/recommendations");
  return res.data;
};

/* ===========================
   CAREER PATH (SKILL BASED)
=========================== */
export const getCareerPath = async (skills) => {
  const res = await API.post("/career/recommend", { skills });
  return res.data;
};
export const downloadCVReport = async () => {
  const res = await API.get("/cv/download", {
    responseType: "blob",
  });
  return res;
};

export default API;

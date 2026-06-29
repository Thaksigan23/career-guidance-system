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
   EMPLOYER SUMMARY (insights)
=========================== */
export const getEmployerSummary = async () => {
  const res = await API.get("/employer/summary");
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

/* ===========================
   ACTIVITY FEED
=========================== */
export const getFeed = async () => (await API.get("/social/feed")).data;
export const createPost = async (content) =>
  (await API.post("/social/posts", { content })).data;
export const deletePost = async (id) =>
  (await API.delete(`/social/posts/${id}`)).data;
export const likePost = async (id) =>
  (await API.post(`/social/posts/${id}/like`)).data;
export const unlikePost = async (id) =>
  (await API.delete(`/social/posts/${id}/like`)).data;
export const getPostComments = async (id) =>
  (await API.get(`/social/posts/${id}/comments`)).data;
export const addPostComment = async (id, content) =>
  (await API.post(`/social/posts/${id}/comments`, { content })).data;

/* ===========================
   NETWORK / CONNECTIONS
=========================== */
export const getConnections = async () => (await API.get("/connections")).data;
export const getPendingRequests = async () =>
  (await API.get("/connections/pending")).data;
export const getConnectionSuggestions = async () =>
  (await API.get("/connections/suggestions")).data;
export const getConnectionStatus = async (id) =>
  (await API.get(`/connections/status/${id}`)).data;
export const sendConnectionRequest = async (id) =>
  (await API.post(`/connections/request/${id}`)).data;
export const respondConnection = async (connectionId, action) =>
  (await API.post(`/connections/respond/${connectionId}`, { action })).data;
export const removeConnection = async (userId) =>
  (await API.delete(`/connections/${userId}`)).data;

/* ===========================
   PROFILE (public / timelines / endorsements)
=========================== */
export const getPublicProfile = async (id) =>
  (await API.get(`/profile/${id}`)).data;
export const addExperience = async (payload) =>
  (await API.post("/profile/experience", payload)).data;
export const deleteExperience = async (id) =>
  (await API.delete(`/profile/experience/${id}`)).data;
export const addEducation = async (payload) =>
  (await API.post("/profile/education", payload)).data;
export const deleteEducation = async (id) =>
  (await API.delete(`/profile/education/${id}`)).data;
export const endorseSkill = async (userId, skill) =>
  (await API.post(`/profile/${userId}/endorse`, { skill })).data;
export const removeEndorsement = async (userId, skill) =>
  (await API.delete(`/profile/${userId}/endorse`, { data: { skill } })).data;

export default API;

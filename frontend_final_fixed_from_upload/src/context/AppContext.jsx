import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export default function AppProvider({ children }) {
  // GLOBAL USER
  const [user, setUser] = useState(null);

  // GLOBAL JOBS
  const [jobs, setJobs] = useState([]);

  // Load user + jobs from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    const savedJobs = JSON.parse(localStorage.getItem("jobs")) || [];

    if (savedUser) setUser(savedUser);
    if (savedJobs) setJobs(savedJobs);
  }, []);

  // Save when updated
  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // AUTH UTILS
  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("currentUser");
  }

  // JOB UTILS
  function addJob(job) {
    setJobs((prev) => [...prev, job]);
  }

  return (
    <AppContext.Provider value={{ user, login, logout, jobs, addJob }}>
      {children}
    </AppContext.Provider>
  );
}

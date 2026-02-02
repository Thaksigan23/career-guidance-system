import { createContext, useContext, useEffect, useState } from "react";

// Create context
const AppContext = createContext();

/* =========================
   MAIN PROVIDER
========================= */
export const AppProvider = ({ children }) => {
  // GLOBAL USER (includes token)
  const [user, setUser] = useState(null);

  // GLOBAL JOBS
  const [jobs, setJobs] = useState([]);

  /* =========================
     LOAD FROM LOCAL STORAGE
  ========================= */
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    const savedJobs = JSON.parse(localStorage.getItem("jobs")) || [];

    if (savedUser) setUser(savedUser);
    if (savedJobs) setJobs(savedJobs);
  }, []);

  /* =========================
     SAVE TO LOCAL STORAGE
  ========================= */
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  /* =========================
     AUTH FUNCTIONS
  ========================= */
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  /* =========================
     JOB FUNCTIONS
  ========================= */
  const addJob = (job) => {
    setJobs((prevJobs) => [...prevJobs, job]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token: user?.token, // ⭐ important
        jobs,
        login,
        logout,
        addJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* =========================
   CUSTOM HOOKS
========================= */

// General app access
export const useApp = () => {
  return useContext(AppContext);
};

// Auth-specific hook (USED BY RECOMMENDATIONS)
export const useAuth = () => {
  const { user, token } = useContext(AppContext);
  return { user, token };
};

import { createContext, useContext, useEffect, useState } from "react";

// Create context
const AppContext = createContext();

function loadUserFromStorage() {
  try {
    const primary = localStorage.getItem("user");
    if (primary) return JSON.parse(primary);
    const legacy = localStorage.getItem("currentUser");
    if (legacy) {
      localStorage.setItem("user", legacy);
      localStorage.removeItem("currentUser");
      return JSON.parse(legacy);
    }
  } catch {
    /* ignore */
  }
  return null;
}

function loadJobsFromStorage() {
  try {
    const raw = localStorage.getItem("jobs");
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

/* =========================
   MAIN PROVIDER
========================= */
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadUserFromStorage());
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [jobs, setJobs] = useState(() => loadJobsFromStorage());

  /* Drop legacy key if anything still wrote it */
  useEffect(() => {
    localStorage.removeItem("currentUser");
  }, []);

  /* =========================
     SAVE TO LOCAL STORAGE
  ========================= */
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
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
    setToken(localStorage.getItem("token"));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
        token,
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

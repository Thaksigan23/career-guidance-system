import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar";
import { useApp } from "./context/AppContext.jsx";

import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";

import StudentProfile from "./pages/StudentProfile";
import EmployerProfile from "./pages/EmployerProfile";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import SavedJobs from "./pages/SavedJobs";
import MyApplications from "./pages/MyApplications";

import EmployerJobs from "./pages/EmployerJobs";
import EmployerApplicants from "./pages/EmployerApplicants";

import CVEvaluator from "./pages/CVEvaluator";
import Recommendations from "./pages/Recommendations";

import EmployerDashboard from "./pages/EmployerDashboard";
import ProfileView from "./pages/ProfileView";

import CVAnalysis from "./pages/CVAnalysis";
import CVHistory from "./pages/CVHistory";
import CareerPath from "./pages/CareerPath";
import Feed from "./pages/Feed";
import Network from "./pages/Network";
import PublicProfile from "./pages/PublicProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminJobs from "./pages/AdminJobs";

// Landing page for guests; logged-in students/employers see their home feed,
// while admins go straight to the admin dashboard.
function HomeRoute() {
  const { user } = useApp();

  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  if (user?.role === "student" || user?.role === "employer") return <Feed />;

  return <Landing />;
}

function App() {
  return (
    <Router>
      <NavBar />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: "rgba(20, 16, 46, 0.95)",
            color: "#e2e8f0",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            fontSize: "0.9rem",
          },
          success: { iconTheme: { primary: "#06b6d4", secondary: "#0c0a1d" } },
          error: { iconTheme: { primary: "#f43f5e", secondary: "#0c0a1d" } },
        }}
      />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomeRoute />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* JOBS PAGE */}
        <Route path="/jobs" element={<Jobs />} />

        {/* ================================
            SOCIAL / NETWORK (all roles)
        ================================= */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute allowedRoles={["student", "employer", "admin"]}>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/network"
          element={
            <ProtectedRoute allowedRoles={["student", "employer", "admin"]}>
              <Network />
            </ProtectedRoute>
          }
        />
        <Route
          path="/u/:id"
          element={
            <ProtectedRoute allowedRoles={["student", "employer", "admin"]}>
              <PublicProfile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={["student", "employer"]}>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        {/* ================================
            STUDENT-ONLY ROUTES
        ================================= */}
        <Route
          path="/student-profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Recommendations />
            </ProtectedRoute>
          }
        />

        {/* ================================
            EMPLOYER-ONLY ROUTES
        ================================= */}
        <Route
          path="/employer-profile"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer-jobs"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer-applicants/:jobId"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerApplicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================================
            CV TOOLS (Both Roles)
        ================================= */}
        <Route
          path="/cv"
          element={
            <ProtectedRoute allowedRoles={["student", "employer"]}>
              <CVEvaluator />
            </ProtectedRoute>
          }
        />

<Route
  path="/cv-history"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <CVHistory />
    </ProtectedRoute>
  }
/>
<Route
  path="/career-path"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <CareerPath />
    </ProtectedRoute>
  }
/>

        <Route
          path="/cv-analysis"
          element={
            <ProtectedRoute allowedRoles={["student", "employer"]}>
              <CVAnalysis />
            </ProtectedRoute>
          }
        />

        {/* PROFILE VIEW */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["student", "employer"]}>
              <ProfileView />
            </ProtectedRoute>
          }
        />
        {/* ================================
    ADMIN-ONLY ROUTES
================================= */}

<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminUsers />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/jobs"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminJobs />
    </ProtectedRoute>
  }
/>


      </Routes>
    </Router>
  );
}

export default App;

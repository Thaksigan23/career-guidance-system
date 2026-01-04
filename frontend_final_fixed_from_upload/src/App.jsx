import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

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

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* JOBS PAGE */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={["student", "employer"]}>
              <Jobs />
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

      </Routes>
    </Router>
  );
}

export default App;

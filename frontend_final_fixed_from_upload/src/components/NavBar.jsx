import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false); // dropdown
  const [mobileMenu, setMobileMenu] = useState(false); // mobile menu

  let user = null;

  // Safe user loading
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined" && stored !== "null") {
      user = JSON.parse(stored);
    }
  } catch (e) {
    console.error("User parse error", e);
  }

  // Auto avatar
  const avatarUrl = user
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.full_name || "User"
      )}&background=0D8ABC&color=fff&size=64&rounded=true`
    : null;

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <h1 className="text-2xl font-bold text-gray-800">
            Career Guidance Platform
          </h1>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden block text-3xl text-gray-700"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            ☰
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">

            <Link to="/" className="nav-link">Home</Link>
            <Link to="/jobs" className="nav-link">Jobs</Link>

            {/* Student Navigation */}
            {user?.role === "student" && (
              <>
                <Link to="/profile" className="nav-link">Profile</Link>
                <Link to="/saved-jobs" className="nav-link">Saved Jobs</Link>
                <Link to="/my-applications" className="nav-link">My Applications</Link>
                <Link to="/recommendations" className="nav-link">Recommendations</Link>
                <Link to="/cv-analysis" className="nav-link">CV Analysis</Link> {/* FIXED */}
              </>
            )}

            {/* Employer Navigation */}
            {user?.role === "employer" && (
              <>
                <Link to="/employer-jobs" className="nav-link">My Posted Jobs</Link>
                <Link to="/employer-dashboard" className="nav-link">Dashboard</Link>
              </>
            )}

            {/* Admin Navigation */}
            {user?.role === "admin" && (
              <Link to="/admin-dashboard" className="nav-link">Admin Dashboard</Link>
            )}

            {/* Login / Avatar + Dropdown */}
            {!user ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center nav-username"
                >
                  <img
                    src={avatarUrl}
                    className="w-9 h-9 rounded-full mr-2 shadow transition-transform duration-200 hover:scale-110"
                    alt="avatar"
                  />
                  {user.full_name}
                  <span className="ml-1">▼</span>
                </button>

                {/* Dropdown */}
                {open && (
                  <div className="fade-in absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">

                    {user.role === "student" && (
                      <>
                        <Link
                          to="/student-profile"
                          className="dropdown-item"
                          onClick={() => setOpen(false)}
                        >
                          Profile
                        </Link>

                        <Link
                          to="/cv-analysis"
                          className="dropdown-item"
                          onClick={() => setOpen(false)}
                        >
                          CV Analysis
                        </Link> {/* ADDED */}
                      </>
                    )}

                    {user.role === "employer" && (
                      <Link
                        to="/employer-profile"
                        className="dropdown-item"
                        onClick={() => setOpen(false)}
                      >
                        Profile
                      </Link>
                    )}

                    {user.role === "admin" && (
                      <Link
                        to="/admin-dashboard"
                        className="dropdown-item"
                        onClick={() => setOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="dropdown-item text-red-600"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-white shadow-md py-4 space-y-2 animate-slideDown">

            <Link to="/" className="mobile-link">Home</Link>
            <Link to="/jobs" className="mobile-link">Jobs</Link>

            {user?.role === "student" && (
              <>
                <Link to="/profile" className="mobile-link">Profile</Link>
                <Link to="/saved-jobs" className="mobile-link">Saved Jobs</Link>
                <Link to="/my-applications" className="mobile-link">My Applications</Link>
                <Link to="/recommendations" className="mobile-link">Recommendations</Link>
                <Link to="/cv-analysis" className="mobile-link">CV Analysis</Link> {/* FIXED */}
              </>
            )}

            {user?.role === "employer" && (
              <>
                <Link to="/employer-jobs" className="mobile-link">My Posted Jobs</Link>
                <Link to="/employer-dashboard" className="mobile-link">Dashboard</Link>
              </>
            )}

            {user?.role === "admin" && (
              <Link to="/admin-dashboard" className="mobile-link">Admin Dashboard</Link>
            )}

            {!user ? (
              <>
                <Link to="/login" className="mobile-link">Login</Link>
                <Link to="/register" className="mobile-link">Register</Link>
              </>
            ) : (
              <button onClick={logout} className="mobile-link text-red-600">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

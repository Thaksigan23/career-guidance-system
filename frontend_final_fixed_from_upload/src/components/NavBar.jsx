import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to parse user", err);
      setUser(null);
    }
  }, []);

  const avatarUrl = user
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.full_name || "User"
      )}&background=0D8ABC&color=fff&size=64&rounded=true`
    : null;

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login"); // ✅ SPA navigation ONLY
  };

  return (
    <nav className="navbar">
  <div className="navbar-container">

    {/* LOGO */}
    <h1
      className="navbar-logo"
      onClick={() => navigate("/")}
    >
      Career<span>Guide</span>
    </h1>

    {/* MOBILE MENU BUTTON */}
    <button
      className="navbar-hamburger"
      onClick={() => setMobileMenu(!mobileMenu)}
    >
      ☰
    </button>

    {/* DESKTOP MENU */}
    <div className="navbar-links">

      <Link to="/" className="nav-link">Home</Link>
      <Link to="/jobs" className="nav-link">Jobs</Link>

      {/* STUDENT MENU */}
      {user?.role === "student" && (
        <>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/saved-jobs" className="nav-link">Saved</Link>
          <Link to="/my-applications" className="nav-link">Applications</Link>
          <Link to="/recommendations" className="nav-link">AI Jobs</Link>
          <Link to="/cv-analysis" className="nav-link">CV Analyzer</Link>
          <Link to="/cv-history" className="nav-link">CV History</Link>
        </>
      )}

      {/* EMPLOYER MENU */}
      {user?.role === "employer" && (
        <>
          <Link to="/employer-jobs" className="nav-link">My Jobs</Link>
          <Link to="/employer-dashboard" className="nav-link">Dashboard</Link>
        </>
      )}

      {/* ADMIN MENU */}
      {user?.role === "admin" && (
        <>
          <Link to="/admin" className="nav-link admin-link">
            Admin Dashboard
          </Link>
          <Link to="/admin/users" className="nav-link">Users</Link>
          <Link to="/admin/jobs" className="nav-link">Jobs</Link>
        </>
      )}

      {/* AUTH */}
      {!user ? (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link register-btn">
            Register
          </Link>
        </>
      ) : (
        <div className="profile-menu">
          <button
            onClick={() => setOpen(!open)}
            className="profile-btn"
          >
            <img src={avatarUrl} alt="avatar" />
            <span>{user.full_name}</span>
          </button>

          {open && (
            <div className="dropdown fade-in">
              <Link to="/profile" className="dropdown-item">
                My Profile
              </Link>
              <button
                onClick={logout}
                className="dropdown-item danger"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</nav>

  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";
import API from "../api/api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        window.location.href = "/admin";
      } else if (res.data.user.role === "employer") {
        window.location.href = "/employer-dashboard";
      } else {
        window.location.href = "/student-profile";
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="grid-overlay" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-7 reveal reveal-1">
          <span className="hero-badge">
            <Sparkles size={15} className="text-orange-400" />
            Welcome back
          </span>
          <h2 className="mt-5 text-4xl font-extrabold text-white">
            Sign in to <span className="text-gradient">CareerGuide</span>
          </h2>
          <p className="mt-2 text-slate-400">
            Continue your career journey where you left off.
          </p>
        </div>

        <div className="glass-card reveal reveal-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="auth-input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth-input pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-lg disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <LogIn size={19} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Phone, Briefcase, GraduationCap, UserPlus, Sparkles } from "lucide-react";
import API from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
      });

      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="grid-overlay" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-7 reveal reveal-1">
          <span className="hero-badge">
            <Sparkles size={15} className="text-orange-400" />
            Get started free
          </span>
          <h2 className="mt-5 text-4xl font-extrabold text-white">
            Create your <span className="text-gradient">account</span>
          </h2>
          <p className="mt-2 text-slate-400">
            Join thousands shaping their future with CareerGuide.
          </p>
        </div>

        <div className="glass-card reveal reveal-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Account type toggle */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "student", label: "Student", icon: GraduationCap },
                  { value: "employer", label: "Employer", icon: Briefcase },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setForm({ ...form, role: value })}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      form.role === value
                        ? "border-cyan-400/60 bg-cyan-400/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="auth-input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                Phone <span className="text-slate-500">(optional)</span>
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 555 000 0000"
                  className="auth-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <UserPlus size={19} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

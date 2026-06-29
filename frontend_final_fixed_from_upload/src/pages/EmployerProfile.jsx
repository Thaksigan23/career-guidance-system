import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  User,
  Mail,
  Phone,
  BriefcaseBusiness,
  Save,
} from "lucide-react";
import API from "../api/api";

export default function EmployerProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await API.get("/employers/me");
        const data = res.data;
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          company: data.company || "",
          position: data.position || "",
        });
      } catch (err) {
        console.log("Error loading employer profile:", err);
        toast.error("Failed to load employer profile. Please log in again.");
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await API.post("/employers/me", form);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update employer profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="aurora-page text-center text-slate-400 text-lg">
        Loading profile...
      </div>
    );

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    form.company || form.name || "Company"
  )}&background=06B6D4&color=fff&size=160&rounded=true&bold=true`;

  return (
    <div className="aurora-page px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER CARD */}
        <div className="panel overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-orange-500/20 relative">
            <div className="absolute inset-0 grid-overlay opacity-40" />
          </div>
          <div className="px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
              <div className="bg-gradient-to-r from-cyan-400 to-violet-500 p-1 rounded-2xl shadow-xl w-fit">
                <img
                  src={avatarUrl}
                  alt="Company"
                  className="w-28 h-28 rounded-2xl bg-[#0c0a1d]"
                />
              </div>
              <div className="sm:pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">
                    {form.company || "Your Company"}
                  </h2>
                  <span className="badge badge-blue">
                    <Building2 size={13} /> Employer
                  </span>
                </div>
                <p className="muted mt-1 inline-flex items-center gap-1.5">
                  <User size={14} /> {form.name || "—"}
                  {form.position ? ` · ${form.position}` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT FORM */}
        <div className="panel p-8">
          <h3 className="panel-title mb-6 inline-flex items-center gap-2">
            <BriefcaseBusiness size={18} className="text-cyan-400" /> Profile
            Details
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="field-label inline-flex items-center gap-1.5">
                  <User size={14} /> Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="field"
                />
              </div>

              <div>
                <label className="field-label inline-flex items-center gap-1.5">
                  <Mail size={14} /> Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  disabled
                  className="field opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="field-label inline-flex items-center gap-1.5">
                  <Phone size={14} /> Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="field"
                />
              </div>

              <div>
                <label className="field-label inline-flex items-center gap-1.5">
                  <Building2 size={14} /> Company Name
                </label>
                <input
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  className="field"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="field-label inline-flex items-center gap-1.5">
                <BriefcaseBusiness size={14} /> Your Position
              </label>
              <input
                name="position"
                type="text"
                value={form.position}
                placeholder="e.g., HR Manager, Tech Recruiter"
                onChange={handleChange}
                className="field"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 btn-glow font-semibold py-2.5 px-7 rounded-xl inline-flex items-center gap-2 disabled:opacity-60"
            >
              <Save size={16} /> {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

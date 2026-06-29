import { useEffect, useState } from "react";
import API from "../api/api";

export default function StudentProfile() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    education: "",
    degree: "",
    experience_years: "",
    skills: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);
  const [cvUrl, setCvUrl] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);

  // 🔁 LOAD STUDENT PROFILE
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await API.get("/students/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = res.data || {};

        setForm({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          education: data.education || "",
          degree: data.degree || "",
          experience_years: data.experience_years || "",
          skills: data.skills || "",
          experience: data.experience || "",
        });
        setCvUrl(data.cv_url || "");
      } catch (err) {
        console.error("Profile load error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // ✏️ HANDLE INPUT
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCVSelect(e) {
    setCvFile(e.target.files?.[0] || null);
  }

  // 💾 SAVE PROFILE
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await API.post("/students/me", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Profile saved successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  }

  async function handleUploadCV() {
    if (!cvFile) {
      alert("Please choose a CV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);

    try {
      setCvUploading(true);
      const res = await API.post("/students/me/cv", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setCvUrl(res.data.cv_url || "");
      setCvFile(null);
      alert("CV uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload CV");
    } finally {
      setCvUploading(false);
    }
  }

  async function handleDeleteCV() {
    if (!window.confirm("Delete your uploaded CV?")) return;
    try {
      await API.delete("/students/me/cv", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCvUrl("");
      setCvFile(null);
      alert("CV deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete CV");
    }
  }

  const cvLink = cvUrl
    ? `${import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") || "http://localhost:5000"}${cvUrl}`
    : "";

  if (loading) {
    return (
      <div className="aurora-page text-center text-slate-400 text-lg">
        Loading profile...
      </div>
    );
  }

  // Avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    form.full_name || "User"
  )}&background=8B5CF6&color=fff&size=128&rounded=true`;

  return (
    <div className="aurora-page px-4">
      <div className="max-w-4xl mx-auto">
        <div className="panel p-8">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-12">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-28 h-28 rounded-full shadow-xl ring-4 ring-violet-500/40 mb-4"
            />

            <h2 className="page-title">
              {form.full_name || "Student Profile"}
            </h2>

            <p className="page-subtitle">{form.email}</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* PERSONAL INFO */}
            <div className="mb-10">
              <h3 className="panel-title mb-4">Personal Information</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="field-label">Full Name</label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    className="field"
                  />
                </div>

                <div>
                  <label className="field-label">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="field"
                  />
                </div>
              </div>
            </div>

            {/* ACADEMIC INFO */}
            <div className="mb-10">
              <h3 className="panel-title mb-4">Academic Information</h3>

              <div className="mb-4">
                <label className="field-label">Education</label>
                <input
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  className="field"
                  placeholder="University / Institute"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="field-label">Degree</label>
                  <input
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    className="field"
                    placeholder="BSc in Computer Science"
                  />
                </div>

                <div>
                  <label className="field-label">Experience (Years)</label>
                  <input
                    name="experience_years"
                    type="number"
                    min="0"
                    value={form.experience_years}
                    onChange={handleChange}
                    className="field"
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="field-label">Skills</label>
                <textarea
                  name="skills"
                  rows="3"
                  value={form.skills}
                  onChange={handleChange}
                  className="field"
                  placeholder="JavaScript, React, Node.js"
                />
              </div>

              <div>
                <label className="field-label">Experience Details</label>
                <textarea
                  name="experience"
                  rows="4"
                  value={form.experience}
                  onChange={handleChange}
                  className="field"
                  placeholder="Worked as intern / projects / responsibilities"
                />
              </div>
            </div>

            {/* CV UPLOAD */}
            <div className="mb-10">
              <h3 className="panel-title mb-4">CV / Resume</h3>
              <p className="text-sm muted mb-3">
                Upload PDF, DOC, or DOCX up to 5MB.
              </p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCVSelect}
                className="field mb-4 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-500/30 file:px-4 file:py-1.5 file:text-violet-100"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleUploadCV}
                  disabled={cvUploading}
                  className="btn-glow font-semibold px-5 py-2 rounded-xl disabled:opacity-60"
                >
                  {cvUploading ? "Uploading..." : "Upload CV"}
                </button>

                {cvLink && (
                  <a
                    href={cvLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-success font-semibold px-5 py-2 rounded-xl"
                  >
                    View Current CV
                  </a>
                )}

                {cvLink && (
                  <button
                    type="button"
                    onClick={handleDeleteCV}
                    className="btn-danger font-semibold px-5 py-2 rounded-xl"
                  >
                    Delete CV
                  </button>
                )}
              </div>
            </div>

            {/* SAVE */}
            <div className="text-center">
              <button
                type="submit"
                className="btn-glow font-semibold px-8 py-3 rounded-xl text-lg"
              >
                Save Profile
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

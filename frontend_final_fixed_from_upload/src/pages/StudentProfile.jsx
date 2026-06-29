import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Briefcase, GraduationCap } from "lucide-react";
import API, {
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
} from "../api/api";

export default function StudentProfile() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    headline: "",
    location: "",
    about: "",
    open_to_work: false,
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

  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [expForm, setExpForm] = useState({
    title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    description: "",
  });
  const [eduForm, setEduForm] = useState({
    school: "",
    degree: "",
    field: "",
    start_year: "",
    end_year: "",
  });

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
          headline: data.headline || "",
          location: data.location || "",
          about: data.about || "",
          open_to_work: !!data.open_to_work,
          education: data.education || "",
          degree: data.degree || "",
          experience_years: data.experience_years || "",
          skills: data.skills || "",
          experience: data.experience || "",
        });
        setExperiences(data.experiences || []);
        setEducation(data.education_entries || []);
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

  async function handleAddExperience(e) {
    e.preventDefault();
    if (!expForm.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    try {
      const res = await addExperience(expForm);
      setExperiences((prev) => [res.entry, ...prev]);
      setExpForm({
        title: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        description: "",
      });
      toast.success("Experience added");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add experience");
    }
  }

  async function handleDeleteExperience(id) {
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((x) => x.id !== id));
      toast.success("Experience removed");
    } catch {
      toast.error("Failed to remove");
    }
  }

  async function handleAddEducation(e) {
    e.preventDefault();
    if (!eduForm.school.trim()) {
      toast.error("School is required");
      return;
    }
    try {
      const res = await addEducation(eduForm);
      setEducation((prev) => [res.entry, ...prev]);
      setEduForm({
        school: "",
        degree: "",
        field: "",
        start_year: "",
        end_year: "",
      });
      toast.success("Education added");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add education");
    }
  }

  async function handleDeleteEducation(id) {
    try {
      await deleteEducation(id);
      setEducation((prev) => prev.filter((x) => x.id !== id));
      toast.success("Education removed");
    } catch {
      toast.error("Failed to remove");
    }
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

      toast.success("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    }
  }

  async function handleUploadCV() {
    if (!cvFile) {
      toast.error("Please choose a CV file first.");
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
      toast.success("CV uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload CV");
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
      toast.success("CV deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete CV");
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

                <div>
                  <label className="field-label">Headline</label>
                  <input
                    name="headline"
                    value={form.headline}
                    onChange={handleChange}
                    className="field"
                    placeholder="Aspiring Software Engineer | React & Node"
                  />
                </div>

                <div>
                  <label className="field-label">Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="field"
                    placeholder="Colombo, Sri Lanka"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="field-label">About</label>
                <textarea
                  name="about"
                  rows="4"
                  value={form.about}
                  onChange={handleChange}
                  className="field"
                  placeholder="A short professional summary about you..."
                />
              </div>

              <label className="mt-4 flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="open_to_work"
                  checked={form.open_to_work}
                  onChange={(e) =>
                    setForm({ ...form, open_to_work: e.target.checked })
                  }
                  className="w-5 h-5 accent-cyan-500"
                />
                <span className="text-slate-200">
                  Show <strong>“Open to work”</strong> badge on my profile
                </span>
              </label>
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

        {/* EXPERIENCE TIMELINE */}
        <div className="panel p-8 mt-8">
          <h3 className="panel-title mb-5 inline-flex items-center gap-2">
            <Briefcase size={18} className="text-cyan-400" /> Experience
          </h3>

          {experiences.length > 0 && (
            <div className="space-y-4 mb-6">
              {experiences.map((x) => (
                <div
                  key={x.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <p className="text-white font-semibold">{x.title}</p>
                    {x.company && (
                      <p className="text-slate-300 text-sm">{x.company}</p>
                    )}
                    <p className="text-xs muted mt-0.5">
                      {[x.start_date, x.end_date || "Present"]
                        .filter(Boolean)
                        .join(" — ")}
                      {x.location ? ` · ${x.location}` : ""}
                    </p>
                    {x.description && (
                      <p className="text-slate-300 text-sm mt-1.5 whitespace-pre-line">
                        {x.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteExperience(x.id)}
                    className="text-slate-500 hover:text-red-400 p-1 shrink-0"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={handleAddExperience}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Job Title *</label>
                <input
                  className="field"
                  value={expForm.title}
                  onChange={(e) =>
                    setExpForm({ ...expForm, title: e.target.value })
                  }
                  placeholder="Software Engineering Intern"
                />
              </div>
              <div>
                <label className="field-label">Company</label>
                <input
                  className="field"
                  value={expForm.company}
                  onChange={(e) =>
                    setExpForm({ ...expForm, company: e.target.value })
                  }
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="field-label">Start</label>
                <input
                  className="field"
                  value={expForm.start_date}
                  onChange={(e) =>
                    setExpForm({ ...expForm, start_date: e.target.value })
                  }
                  placeholder="Jan 2024"
                />
              </div>
              <div>
                <label className="field-label">End</label>
                <input
                  className="field"
                  value={expForm.end_date}
                  onChange={(e) =>
                    setExpForm({ ...expForm, end_date: e.target.value })
                  }
                  placeholder="Present"
                />
              </div>
            </div>
            <div>
              <label className="field-label">Location</label>
              <input
                className="field"
                value={expForm.location}
                onChange={(e) =>
                  setExpForm({ ...expForm, location: e.target.value })
                }
                placeholder="Remote / Colombo"
              />
            </div>
            <div>
              <label className="field-label">Description</label>
              <textarea
                rows="3"
                className="field"
                value={expForm.description}
                onChange={(e) =>
                  setExpForm({ ...expForm, description: e.target.value })
                }
                placeholder="What did you work on?"
              />
            </div>
            <button
              type="submit"
              className="btn-soft font-semibold px-5 py-2 rounded-xl inline-flex items-center gap-2"
            >
              <Plus size={16} /> Add Experience
            </button>
          </form>
        </div>

        {/* EDUCATION TIMELINE */}
        <div className="panel p-8 mt-8">
          <h3 className="panel-title mb-5 inline-flex items-center gap-2">
            <GraduationCap size={18} className="text-violet-400" /> Education
          </h3>

          {education.length > 0 && (
            <div className="space-y-4 mb-6">
              {education.map((x) => (
                <div
                  key={x.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <p className="text-white font-semibold">{x.school}</p>
                    {(x.degree || x.field) && (
                      <p className="text-slate-300 text-sm">
                        {[x.degree, x.field].filter(Boolean).join(", ")}
                      </p>
                    )}
                    <p className="text-xs muted mt-0.5">
                      {[x.start_year, x.end_year].filter(Boolean).join(" — ")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEducation(x.id)}
                    className="text-slate-500 hover:text-red-400 p-1 shrink-0"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={handleAddEducation}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4"
          >
            <div>
              <label className="field-label">School *</label>
              <input
                className="field"
                value={eduForm.school}
                onChange={(e) =>
                  setEduForm({ ...eduForm, school: e.target.value })
                }
                placeholder="University of Colombo"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Degree</label>
                <input
                  className="field"
                  value={eduForm.degree}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, degree: e.target.value })
                  }
                  placeholder="BSc"
                />
              </div>
              <div>
                <label className="field-label">Field of study</label>
                <input
                  className="field"
                  value={eduForm.field}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, field: e.target.value })
                  }
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <label className="field-label">Start year</label>
                <input
                  className="field"
                  value={eduForm.start_year}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, start_year: e.target.value })
                  }
                  placeholder="2021"
                />
              </div>
              <div>
                <label className="field-label">End year</label>
                <input
                  className="field"
                  value={eduForm.end_year}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, end_year: e.target.value })
                  }
                  placeholder="2025"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-soft font-semibold px-5 py-2 rounded-xl inline-flex items-center gap-2"
            >
              <Plus size={16} /> Add Education
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

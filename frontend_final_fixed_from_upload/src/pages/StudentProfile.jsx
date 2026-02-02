import { useEffect, useState } from "react";
import API from "../api/api";

export default function StudentProfile() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);

  // LOAD STUDENT PROFILE
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
        skills: data.skills || "",
        experience: data.experience || "",
      });
    } catch (err) {
      console.error("Profile load error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  loadProfile();
}, []);


  // HANDLE INPUT
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // SUBMIT UPDATE
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await API.post(
  "/students/me",
  form,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

      alert("Profile saved successfully!");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Failed to save profile");
    }
  }

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-600 text-lg">
        Loading profile...
      </div>
    );
  }

  // Avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    form.full_name || "User"
  )}&background=0D8ABC&color=fff&size=128&rounded=true`;

  return (
  <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
    <div className="max-w-4xl mx-auto px-4">
      <div className="profile-card">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-32 h-32 rounded-full shadow-xl mb-4 ring-4 ring-indigo-300"
          />

          <h2 className="text-4xl font-extrabold text-indigo-700">
            {form.full_name || "Student Profile"}
          </h2>

          <p className="text-gray-600 mt-1">{form.email}</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* PERSONAL INFO */}
          <div className="mb-10">
            <h3 className="section-title">👤 Personal Information</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label>Full Name</label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* ACADEMIC INFO */}
          <div className="mb-10">
            <h3 className="section-title">🎓 Academic Information</h3>

            <div className="mb-4">
              <label>Education</label>
              <input
                name="education"
                value={form.education}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="mb-4">
              <label>Skills</label>
              <textarea
                name="skills"
                rows="3"
                value={form.skills}
                onChange={handleChange}
                className="textarea-field"
              />
            </div>

            <div>
              <label>Experience</label>
              <textarea
                name="experience"
                rows="4"
                value={form.experience}
                onChange={handleChange}
                className="textarea-field"
              />
            </div>
          </div>

          {/* SAVE */}
          <div className="text-center">
            <button type="submit" className="save-btn">
              💾 Save Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
);

}

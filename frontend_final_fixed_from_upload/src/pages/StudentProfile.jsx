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

  if (loading) {
    return (
      <div className="pt-24 text-center text-gray-600 text-lg">
        Loading profile...
      </div>
    );
  }

  // 🧑 Avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    form.full_name || "User"
  )}&background=6366F1&color=fff&size=128&rounded=true`;

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-12">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full shadow-xl ring-4 ring-indigo-300 mb-4"
            />

            <h2 className="text-4xl font-extrabold text-indigo-700">
              {form.full_name || "Student Profile"}
            </h2>

            <p className="text-gray-600 mt-1">{form.email}</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* PERSONAL INFO */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">
                👤 Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-gray-600">Full Name</label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-600">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
            </div>

            {/* ACADEMIC INFO */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">
                🎓 Academic Information
              </h3>

              <div className="mb-4">
                <label className="block mb-1 text-gray-600">Education</label>
                <input
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="University / Institute"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block mb-1 text-gray-600">Degree</label>
                  <input
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="BSc in Computer Science"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-600">
                    Experience (Years)
                  </label>
                  <input
                    name="experience_years"
                    type="number"
                    min="0"
                    value={form.experience_years}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-gray-600">Skills</label>
                <textarea
                  name="skills"
                  rows="3"
                  value={form.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="JavaScript, React, Node.js"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600">
                  Experience Details
                </label>
                <textarea
                  name="experience"
                  rows="4"
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Worked as intern / projects / responsibilities"
                />
              </div>
            </div>

            {/* SAVE */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 
                           text-white font-bold px-8 py-3 rounded-full 
                           shadow-lg hover:scale-105 transition"
              >
                💾 Save Profile
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

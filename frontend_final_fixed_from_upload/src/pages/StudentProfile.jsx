import { useEffect, useState } from "react";
import API from "../api/api";

export default function StudentProfile() {
  const [form, setForm] = useState({
    name: "",
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
        const res = await API.get("/students/me");
        const data = res.data || {};

        // If profile exists → fill details
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          education: data.education || "",
          skills: data.skills || "",
          experience: data.experience || "",
        });
      } catch (err) {
        console.log("Profile load error:", err);
      }
      setLoading(false);
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
      await API.post("/students/me", form);
      alert("Profile saved!");

      // Redirect to profile viewing page
      window.location.href = "/profile";
    } catch (err) {
      console.log(err);
      alert("Failed to save profile");
    }
  }

  if (loading)
    return (
      <div className="pt-20 text-center text-gray-600 text-lg">
        Loading profile...
      </div>
    );

  // Auto avatar from UI-Avatars API
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    form.name || "User"
  )}&background=0D8ABC&color=fff&size=128&rounded=true`;

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg card-shadow p-8">

          {/* HEADER SECTION */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-28 h-28 rounded-full shadow-md mb-3"
            />

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Student Profile
            </h2>

            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              ← Back
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full px-3 py-2 border rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Education</label>
                <input
                  name="education"
                  type="text"
                  value={form.education}
                  onChange={handleChange}
                  placeholder="e.g., BSc Computer Science"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

            </div>

            <div className="mt-6">
              <label className="block text-gray-700 mb-2">Skills</label>
              <textarea
                name="skills"
                rows="3"
                value={form.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              ></textarea>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 mb-2">Experience</label>
              <textarea
                name="experience"
                rows="4"
                value={form.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-6 btn-primary text-white font-bold py-2 px-6 rounded-md"
            >
              Save Profile
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

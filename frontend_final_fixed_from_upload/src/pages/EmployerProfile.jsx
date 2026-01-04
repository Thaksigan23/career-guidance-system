import { useEffect, useState } from "react";
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

  // LOAD EMPLOYER PROFILE
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
        alert("Failed to load employer profile. Please log in again.");
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  // HANDLE INPUT CHANGE
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // SUBMIT UPDATED PROFILE
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await API.post("/employers/me", form);
      alert("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to update employer profile");
    }
  }

  if (loading)
    return (
      <div className="pt-20 text-center text-gray-600 text-lg">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg card-shadow p-8">

          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Employer Profile
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Grid */}
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
                <label className="block text-gray-700 mb-2">Company Name</label>
                <input
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

            </div>

            {/* Position */}
            <div className="mt-6">
              <label className="block text-gray-700 mb-2">Your Position</label>
              <input
                name="position"
                type="text"
                value={form.position}
                placeholder="e.g., HR Manager, Tech Recruiter"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="mt-6 btn-primary text-white font-bold py-2 px-6 rounded-md"
            >
              Update Profile
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

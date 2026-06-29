import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
        toast.error("Failed to load employer profile. Please log in again.");
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
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update employer profile");
    }
  }

  if (loading)
    return (
      <div className="aurora-page text-center text-slate-400 text-lg">
        Loading profile...
      </div>
    );

  return (
    <div className="aurora-page px-4">
      <div className="max-w-4xl mx-auto">
        <div className="panel p-8">

          <h2 className="page-title mb-8">Employer Profile</h2>

          <form onSubmit={handleSubmit}>

            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="field-label">Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="field"
                />
              </div>

              <div>
                <label className="field-label">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  disabled
                  className="field opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="field-label">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="field"
                />
              </div>

              <div>
                <label className="field-label">Company Name</label>
                <input
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  className="field"
                />
              </div>

            </div>

            {/* Position */}
            <div className="mt-6">
              <label className="field-label">Your Position</label>
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
              className="mt-6 btn-glow font-semibold py-2.5 px-7 rounded-xl"
            >
              Update Profile
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

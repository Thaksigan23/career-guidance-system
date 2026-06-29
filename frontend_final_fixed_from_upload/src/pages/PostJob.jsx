import { useState } from "react";
import toast from "react-hot-toast";
import API from "../api/api";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await API.post("/jobs", form);
      toast.success("Job posted successfully!");

      // Clear form after posting
      setForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        requirements: "",
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to post job");
    }
  }

  return (
    <div className="aurora-page px-4">
      <div className="max-w-4xl mx-auto">
        <div className="panel p-8">
          <h2 className="page-title mb-8">Post a Job</h2>

          <form onSubmit={handleSubmit}>
            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div>
                <label className="field-label">Job Title</label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="field"
                />
              </div>

              {/* Company */}
              <div>
                <label className="field-label">Company Name</label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  required
                  className="field"
                />
              </div>

              {/* Location */}
              <div>
                <label className="field-label">Location</label>
                <input
                  id="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="field"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="field-label">Salary Range</label>
                <input
                  id="salary"
                  type="text"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. 50000 - 70000"
                  className="field"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="field-label">Job Description</label>
              <textarea
                id="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
                className="field"
              ></textarea>
            </div>

            {/* Requirements */}
            <div className="mt-6">
              <label className="field-label">Requirements</label>
              <textarea
                id="requirements"
                rows="3"
                value={form.requirements}
                onChange={handleChange}
                required
                className="field"
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-6 btn-glow font-semibold py-2.5 px-7 rounded-xl"
            >
              Post Job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
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
      await API.post("/jobs/post", form);
      alert("Job posted successfully!");

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
      alert(err.response?.data?.error || "Failed to post job");
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg card-shadow p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Post a Job</h2>

          <form onSubmit={handleSubmit}>
            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Job Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Company Name
                </label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Salary Range
                </label>
                <input
                  id="salary"
                  type="text"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. $50,000 - $70,000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Job Description
              </label>
              <textarea
                id="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>

            {/* Requirements */}
            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Requirements
              </label>
              <textarea
                id="requirements"
                rows="3"
                value={form.requirements}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-6 btn-primary text-white font-bold py-2 px-6 rounded-md"
            >
              Post Job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

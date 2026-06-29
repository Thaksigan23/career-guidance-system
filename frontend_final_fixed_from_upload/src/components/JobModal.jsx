import { useState } from "react";

export default function JobModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
  });

  if (!isOpen) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm({
      title: "",
      company: "",
      location: "",
      salary: "",
      description: "",
      requirements: "",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);   // send data to backend
    resetForm();      // reset modal form
  }

  function closeModal() {
    resetForm();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="panel p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h3 className="page-title text-2xl">Post a Job</h3>

          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid md:grid-cols-2 gap-4 mb-4">

            {/* Job Title */}
            <div>
              <label className="field-label">Job Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="field"
                required
              />
            </div>

            {/* Company */}
            <div>
              <label className="field-label">Company</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="field"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="field-label">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="field"
                required
              />
            </div>

            {/* Salary */}
            <div>
              <label className="field-label">Salary</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g., 70000"
                className="field"
              />
            </div>

          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="field-label">Description</label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              className="field"
              required
            ></textarea>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <label className="field-label">Requirements</label>
            <textarea
              name="requirements"
              rows="3"
              value={form.requirements}
              onChange={handleChange}
              className="field"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-glow w-full py-3 rounded-xl font-semibold"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

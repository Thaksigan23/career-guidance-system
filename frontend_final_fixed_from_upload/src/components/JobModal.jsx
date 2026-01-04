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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Post a Job</h3>

          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid md:grid-cols-2 gap-4 mb-4">

            {/* Job Title */}
            <div>
              <label className="block mb-2 font-semibold">Job Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            {/* Company */}
            <div>
              <label className="block mb-2 font-semibold">Company</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block mb-2 font-semibold">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block mb-2 font-semibold">Salary</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g., $70,000 - $90,000"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Description</label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            ></textarea>
          </div>

          {/* Requirements */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Requirements</label>
            <textarea
              name="requirements"
              rows="3"
              value={form.requirements}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full text-white py-2 rounded"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

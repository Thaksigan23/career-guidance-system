import { useState } from "react";
import API from "../api/api";
import { Search, MapPin, DollarSign, Layers } from "lucide-react";

export default function Recommendations() {
  const [form, setForm] = useState({
    skills: "",
    location: "",
    experience: "entry",
    salary: "",
  });

  const [results, setResults] = useState([]);

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  function generateRecommendations(e) {
    e.preventDefault();

    const { location } = form;

    // IMPORTANT: use NUMERIC job IDs
    const sample = [
      {
        id: 101,
        position: "Frontend Developer",
        company: "Tech Innovations Inc.",
        location: location || "San Francisco, CA",
        salary: "85000",
        match: "95%",
        description: "Build modern web applications with React.",
        requirements: "React, JavaScript, HTML/CSS",
      },
      {
        id: 102,
        position: "Software Engineer Intern",
        company: "StartupXYZ",
        location: location || "Remote",
        salary: "20/hour",
        match: "88%",
        description: "Gain hands-on experience in software development.",
        requirements: "Basic programming knowledge, willingness to learn",
      },
      {
        id: 103,
        position: "Data Analyst",
        company: "Analytics Pro",
        location: location || "New York, NY",
        salary: "70000",
        match: "82%",
        description: "Analyze and interpret business data.",
        requirements: "Python, SQL, Data Visualization",
      },
    ];

    setResults(sample);
  }

  // 🔥 REAL SAVE JOB FUNCTION (works with backend)
  async function saveJob(job_id) {
    try {
      await API.post("/saved/save", { job_id });
      alert("Job saved!");
    } catch (err) {
      console.log(err);
      alert("Failed to save job");
    }
  }

  async function apply(job_id) {
    try {
      await API.post("/applications/apply", { job_id });
      alert("Application submitted!");
    } catch (err) {
      console.log(err);
      alert("Failed to apply");
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Job Recommendations
        </h2>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow p-8 mb-10">
          <h3 className="text-xl font-bold text-gray-700 mb-6">
            Tell us about your preferences
          </h3>

          <form onSubmit={generateRecommendations} className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">

              {/* Skills */}
              <div>
                <label className="font-semibold mb-1 block">Your Skills</label>
                <div className="flex items-center border px-3 py-2 rounded-md bg-gray-50">
                  <Search className="text-gray-500 mr-2" size={20} />
                  <input
                    id="skills"
                    type="text"
                    placeholder="e.g., JavaScript, Python"
                    value={form.skills}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="font-semibold mb-1 block">Preferred Location</label>
                <div className="flex items-center border px-3 py-2 rounded-md bg-gray-50">
                  <MapPin className="text-gray-500 mr-2" size={20} />
                  <input
                    id="location"
                    type="text"
                    placeholder="e.g., Remote, Colombo"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="font-semibold mb-1 block">Experience Level</label>
                <div className="flex items-center border px-3 py-2 rounded-md bg-gray-50">
                  <Layers className="text-gray-500 mr-2" size={20} />
                  <select
                    id="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>
              </div>

              {/* Salary */}
              <div>
                <label className="font-semibold mb-1 block">Expected Salary</label>
                <div className="flex items-center border px-3 py-2 rounded-md bg-gray-50">
                  <DollarSign className="text-gray-500 mr-2" size={20} />
                  <input
                    id="salary"
                    type="text"
                    placeholder="e.g., $60,000+"
                    value={form.salary}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
              Get Recommendations
            </button>
          </form>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Recommended Jobs
        </h3>

        {/* Empty */}
        {results.length === 0 && (
          <p className="text-gray-600">Fill the form to get recommendations.</p>
        )}

        {/* Job Cards */}
        <div className="space-y-6">
          {results.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{job.position}</h3>
                  <p className="text-blue-600">{job.company}</p>
                  <p className="text-gray-600">{job.location}</p>
                </div>

                <div className="text-right">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {job.match} Match
                  </span>
                  <p className="text-lg font-semibold text-green-600 mt-2">
                    Rs. {job.salary}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{job.description}</p>

              <h4 className="font-semibold text-gray-800 mb-1">Requirements:</h4>
              <p className="text-gray-700 mb-4">{job.requirements}</p>

              <div className="flex space-x-3">
                <button
                  onClick={() => apply(job.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Apply Now
                </button>

                <button
                  onClick={() => saveJob(job.id)}
                  className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Save for Later
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

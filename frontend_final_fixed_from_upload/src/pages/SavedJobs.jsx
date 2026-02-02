import { useEffect, useState } from "react";
import { getSavedJobs, removeSavedJob, applyJob } from "../api/api";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // LOAD SAVED JOBS
  const loadSavedJobs = async () => {
    try {
      const data = await getSavedJobs();
      setJobs(data);
    } catch (err) {
      console.error("Saved jobs error:", err);
      setMessage("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE SAVED JOB
  const handleRemove = async (saved_id) => {
    try {
      const res = await removeSavedJob(saved_id);
      setJobs(jobs.filter(job => job.saved_id !== saved_id));
      setMessage(res.message || "Job removed");
    } catch (err) {
      console.error(err);
      setMessage("Failed to remove job");
    }
  };

  // APPLY JOB
  const handleApply = async (job_id) => {
    try {
      const res = await applyJob(job_id);
      setMessage(res.message || "Application submitted");
    } catch (err) {
      console.error(err);
      setMessage("Failed to apply for job");
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-600 text-lg">
        Loading saved jobs...
      </div>
    );
  }

  return (
  <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4">
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-700">
          💾 Saved Jobs
        </h1>
        <p className="text-gray-600 mt-2">
          Jobs you’ve bookmarked to apply later
        </p>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="mb-6 p-4 rounded-xl bg-blue-100 text-blue-700 text-center font-medium shadow">
          {message}
        </div>
      )}

      {/* EMPTY STATE */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
          ⭐ You haven’t saved any jobs yet.
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.saved_id}
              className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start">

                {/* LEFT INFO */}
                <div>
                  <h2 className="text-2xl font-bold text-blue-700">
                    {job.title}
                  </h2>

                  <p className="text-gray-700 font-medium">
                    🏢 {job.company}
                  </p>

                  <p className="text-gray-500">
                    📍 {job.location}
                  </p>
                </div>

                {/* SALARY */}
                {job.salary && (
                  <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                    💰 Rs. {job.salary}
                  </span>
                )}
              </div>

              {/* DESCRIPTION */}
              <p className="mt-4 text-gray-700 leading-relaxed">
                {job.description}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleApply(job.job_id)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
                >
                  🚀 Apply Now
                </button>

                <button
                  onClick={() => handleRemove(job.saved_id)}
                  className="flex-1 bg-gradient-to-r from-red-200 to-red-300 text-red-800 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}

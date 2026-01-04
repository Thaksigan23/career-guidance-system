import { useEffect, useState } from "react";
import API from "../api/api";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD SAVED JOBS
  async function loadSavedJobs() {
    try {
      const { data } = await API.get("/saved/me");
      setJobs(data);
    } catch (err) {
      console.log("Saved jobs error:", err);
      alert("Failed to load saved jobs.");
    }
    setLoading(false);
  }

  // REMOVE SAVED JOB
  async function removeJob(saved_id) {
    try {
      await API.delete(`/saved/${saved_id}`);
      setJobs(jobs.filter(job => job.saved_id !== saved_id));
    } catch (err) {
      console.log(err);
      alert("Failed to remove job");
    }
  }

  // APPLY JOB
  async function apply(job_id) {
    try {
      await API.post("/applications/apply", { job_id });
      alert("Application submitted!");
    } catch (err) {
      console.log(err);
      alert("Failed to apply");
    }
  }

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
    <div className="min-h-screen pt-20 bg-gray-50 px-4">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>

        {jobs.length === 0 && (
          <p className="text-gray-600">You have no saved jobs.</p>
        )}

        <div className="space-y-6">
          {jobs.map(job => (
            <div
              key={job.saved_id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{job.title}</h2>
                  <p className="text-blue-600">{job.company}</p>
                  <p className="text-gray-600">{job.location}</p>
                </div>

                <p className="text-lg font-semibold text-green-600">
                  Rs. {job.salary}
                </p>
              </div>

              <p className="mt-3 text-gray-700">{job.description}</p>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => apply(job.job_id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Apply Now
                </button>

                <button
                  onClick={() => removeJob(job.saved_id)}
                  className="bg-red-200 text-red-700 px-4 py-2 rounded-md hover:bg-red-300 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

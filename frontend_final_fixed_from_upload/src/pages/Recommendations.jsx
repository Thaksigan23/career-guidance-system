import { useState } from "react";
import { getRecommendations, saveJob, applyJob } from "../api/api";
import { useAuth } from "../context/AppContext.jsx";

const Recommendations = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

  // 🔴 IMPORTANT GUARD
  if (!user || !token) {
    return (
      <div className="aurora-page px-4">
        <div className="max-w-2xl mx-auto panel p-10 text-center text-slate-300">
          <h3 className="page-title text-2xl">Please log in to see job recommendations</h3>
        </div>
      </div>
    );
  }

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getRecommendations();
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
const handleSaveJob = async (job_id) => {
  try {
    const res = await saveJob(job_id);
    setMessage(res.message || "Job saved successfully");
  } catch (error) {
    console.error(error);
    setMessage("Failed to save job");
  }
};
const handleApplyJob = async (job_id) => {
  try {
    const res = await applyJob(job_id);
    setMessage(res.message || "Applied successfully!");
  } catch (error) {
    console.error(error);
    setMessage("Failed to apply for job");
  }
};

  return (
    <div className="aurora-page px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="page-title">AI Job Recommendations</h2>
          <p className="page-subtitle">
            Personalized matches based on your profile skills.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={handleGetRecommendations}
            disabled={loading}
            className="btn-glow px-7 py-3 rounded-xl font-semibold text-lg disabled:opacity-60"
          >
            {loading ? "Finding best jobs..." : "Get Recommendations"}
          </button>
        </div>

        {message && (
          <div className="mt-6 p-4 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 text-center">
            {message}
          </div>
        )}

        <div className="mt-8">
          {!loading && jobs.length === 0 && (
            <div className="panel p-8 text-center">
              <p className="text-white font-semibold">No recommendations yet.</p>
              <p className="text-sm muted mt-1">
                Update your skills in your profile, then click the button above.
              </p>
            </div>
          )}

          {jobs.length > 0 && (
            <div className="grid gap-5">
              {jobs.map((job) => (
                <div key={job.id} className="panel panel-hover p-6">
                  <div className="flex justify-between items-center gap-4">
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <span
                      className={`badge ${
                        job.matchScore >= 70 ? "badge-green" : "badge-yellow"
                      }`}
                    >
                      {job.matchScore}% Match
                    </span>
                  </div>

                  <p className="muted mt-2">
                    {job.company} • {job.location}
                  </p>

                  <p className="text-sm muted mt-2">
                    Required Skills: {job.requirements}
                  </p>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => handleApplyJob(job.id)}
                      className="btn-glow px-5 py-2 rounded-xl font-semibold"
                    >
                      Apply
                    </button>

                    <button
                      onClick={() => handleSaveJob(job.id)}
                      className="btn-soft px-5 py-2 rounded-xl font-semibold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;

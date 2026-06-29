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
      <div className="aurora-page text-center text-slate-400 text-lg">
        Loading saved jobs...
      </div>
    );
  }

  return (
  <div className="aurora-page px-4">
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="page-title">Saved Jobs</h1>
        <p className="page-subtitle">Jobs you&apos;ve bookmarked to apply later.</p>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="mb-6 p-4 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 text-center font-medium">
          {message}
        </div>
      )}

      {/* EMPTY STATE */}
      {jobs.length === 0 ? (
        <div className="panel p-10 text-center text-slate-400">
          You haven&apos;t saved any jobs yet.
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.saved_id} className="panel panel-hover p-6">
              <div className="flex justify-between items-start gap-4">

                {/* LEFT INFO */}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {job.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="badge badge-violet">{job.company}</span>
                    <span className="badge badge-slate">{job.location}</span>
                  </div>
                </div>

                {/* SALARY */}
                {job.salary && (
                  <span className="badge badge-green">Rs. {job.salary}</span>
                )}
              </div>

              {/* DESCRIPTION */}
              <p className="mt-4 text-slate-300 leading-relaxed">
                {job.description}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleApply(job.job_id)}
                  className="btn-glow flex-1 px-4 py-2 rounded-xl font-semibold"
                >
                  Apply Now
                </button>

                <button
                  onClick={() => handleRemove(job.saved_id)}
                  className="btn-danger flex-1 px-4 py-2 rounded-xl font-semibold"
                >
                  Remove
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

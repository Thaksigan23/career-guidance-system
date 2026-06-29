import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/api";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔁 LOAD JOBS
  async function fetchJobs() {
    try {
      const res = await API.get("/admin/jobs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJobs(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ APPROVE
  async function approveJob(jobId) {
    try {
      await API.put(`/admin/jobs/${jobId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setJobs(prev =>
        prev.map(job =>
          job.id === jobId ? { ...job, status: "approved" } : job
        )
      );
      toast.success("Job approved");
    } catch {
      toast.error("Failed to approve job");
    }
  }

  // ❌ REJECT
  async function rejectJob(jobId) {
    try {
      await API.put(`/admin/jobs/${jobId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setJobs(prev =>
        prev.map(job =>
          job.id === jobId ? { ...job, status: "rejected" } : job
        )
      );
      toast.success("Job rejected");
    } catch {
      toast.error("Failed to reject job");
    }
  }

  // 🦴 SKELETON
  function SkeletonCard() {
    return (
      <div className="panel p-6 animate-pulse">
        <div className="h-6 skeleton w-2/3 mb-3"></div>
        <div className="h-4 skeleton w-1/3 mb-4"></div>
        <div className="flex gap-3">
          <div className="h-9 w-24 skeleton"></div>
          <div className="h-9 w-24 skeleton"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="aurora-page px-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aurora-page text-center text-red-300 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="aurora-page px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="page-title">Admin — Manage Jobs</h1>
          <p className="page-subtitle">Approve or reject employer job postings.</p>
        </div>

        {jobs.length === 0 ? (
          <div className="panel p-10 text-center text-slate-400">No jobs found.</div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="panel panel-hover p-6">
                {/* TITLE */}
                <h2 className="text-2xl font-bold text-white">{job.title}</h2>

                <p className="muted mt-1">
                  {job.company} • {job.location}
                </p>

                {/* STATUS */}
                <div className="mt-3">
                  <span
                    className={`badge ${
                      job.status === "approved"
                        ? "badge-green"
                        : job.status === "rejected"
                        ? "badge-red"
                        : "badge-yellow"
                    }`}
                  >
                    {String(job.status || "pending").toUpperCase()}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="mt-5">
                  {String(job.status || "pending") === "pending" ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => approveJob(job.id)}
                        className="btn-success px-5 py-2 rounded-xl font-semibold"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectJob(job.id)}
                        className="btn-danger px-5 py-2 rounded-xl font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm muted italic">Action already taken</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

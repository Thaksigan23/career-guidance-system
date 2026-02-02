import { useEffect, useState } from "react";
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
    } catch {
      alert("Failed to approve job");
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
    } catch {
      alert("Failed to reject job");
    }
  }

  // 🦴 SKELETON
  function SkeletonCard() {
    return (
      <div className="bg-white rounded-xl p-6 shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex gap-3">
          <div className="h-9 w-24 bg-gray-200 rounded"></div>
          <div className="h-9 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-100 to-slate-200 px-4">
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
      <div className="pt-24 text-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Admin – Manage Jobs
          </h1>
          <p className="text-gray-600 mt-1">
            Approve or reject employer job postings
          </p>
        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs found.</p>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 shadow-md 
                           hover:shadow-xl transition"
              >
                {/* TITLE */}
                <h2 className="text-2xl font-bold text-indigo-700">
                  {job.title}
                </h2>

                <p className="text-gray-600 mt-1">
                  {job.company} • {job.location}
                </p>

                {/* STATUS */}
                <div className="mt-3">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-semibold
                      ${
                        job.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : job.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
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
                        className="bg-green-600 text-white px-5 py-2 rounded-lg 
                                   hover:bg-green-700 transition"
                      >
                        ✅ Approve
                      </button>

                      <button
                        onClick={() => rejectJob(job.id)}
                        className="bg-red-600 text-white px-5 py-2 rounded-lg 
                                   hover:bg-red-700 transition"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Action already taken
                    </p>
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

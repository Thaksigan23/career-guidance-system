import { useEffect, useState } from "react";
import API from "../api/api";

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEmployerJobs() {
      try {
        const res = await API.get("/jobs/employer/my");
        setJobs(res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load employer dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEmployerJobs();
  }, []);

  // 🦴 Skeleton Card
  const SkeletonCard = () => (
    <div className="panel p-6 animate-pulse">
      <div className="h-5 skeleton w-1/3 mb-3"></div>
      <div className="h-4 skeleton w-1/2 mb-2"></div>
      <div className="h-4 skeleton w-1/4"></div>
    </div>
  );

  // 📊 Stats
  const totalJobs = jobs.length;
  const approved = jobs.filter(j => j.status === "approved").length;
  const pending = jobs.filter(j => j.status === "pending").length;

  if (loading) {
    return (
      <div className="aurora-page px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {[...Array(4)].map((_, i) => (
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
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="page-title">Employer Dashboard</h1>
          <p className="page-subtitle">
            Overview of your job postings &amp; applicants.
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="panel p-6">
            <p className="muted">Total Jobs</p>
            <h2 className="text-3xl font-bold text-gradient">{totalJobs}</h2>
          </div>

          <div className="panel p-6">
            <p className="muted">Approved Jobs</p>
            <h2 className="text-3xl font-bold text-emerald-400">{approved}</h2>
          </div>

          <div className="panel p-6">
            <p className="muted">Pending Approval</p>
            <h2 className="text-3xl font-bold text-amber-400">{pending}</h2>
          </div>
        </div>

        {/* JOB LIST */}
        {jobs.length === 0 ? (
          <div className="panel p-10 text-center text-slate-400">
            You haven&apos;t posted any jobs yet.
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="panel panel-hover p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">

                  {/* LEFT */}
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {job.title}
                    </h2>

                    <p className="muted mt-1">
                      {job.company} • {job.location}
                    </p>

                    <div className="flex gap-3 mt-3">
                      <span className="badge badge-blue">
                        {job.applicant_count} Applicants
                      </span>

                      <span
                        className={`badge ${
                          job.status === "approved"
                            ? "badge-green"
                            : job.status === "rejected"
                            ? "badge-red"
                            : "badge-yellow"
                        }`}
                      >
                        {job.status || "pending"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

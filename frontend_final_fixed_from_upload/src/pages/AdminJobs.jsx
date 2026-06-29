import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Check,
  X,
} from "lucide-react";
import API from "../api/api";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  async function fetchJobs() {
    try {
      const res = await API.get("/admin/jobs");
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

  async function approveJob(jobId) {
    try {
      await API.put(`/admin/jobs/${jobId}/approve`, {});
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "approved" } : job
        )
      );
      toast.success("Job approved");
    } catch {
      toast.error("Failed to approve job");
    }
  }

  async function rejectJob(jobId) {
    try {
      await API.put(`/admin/jobs/${jobId}/reject`, {});
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "rejected" } : job
        )
      );
      toast.success("Job rejected");
    } catch {
      toast.error("Failed to reject job");
    }
  }

  const counts = useMemo(() => {
    const c = { all: jobs.length, pending: 0, approved: 0, rejected: 0 };
    jobs.forEach((j) => {
      const s = j.status || "pending";
      if (c[s] !== undefined) c[s]++;
    });
    return c;
  }, [jobs]);

  const filtered = useMemo(() => {
    if (filter === "all") return jobs;
    return jobs.filter((j) => (j.status || "pending") === filter);
  }, [jobs, filter]);

  if (loading) {
    return (
      <div className="aurora-page px-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="panel p-6 animate-pulse">
              <div className="h-6 skeleton w-2/3 mb-3" />
              <div className="h-4 skeleton w-1/3 mb-4" />
              <div className="flex gap-3">
                <div className="h-9 w-24 skeleton" />
                <div className="h-9 w-24 skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aurora-page text-center text-red-300 text-lg">{error}</div>
    );
  }

  const stats = [
    { key: "all", label: "All Jobs", value: counts.all, icon: Briefcase, color: "text-cyan-300" },
    { key: "pending", label: "Pending", value: counts.pending, icon: Clock, color: "text-amber-300" },
    { key: "approved", label: "Approved", value: counts.approved, icon: CheckCircle2, color: "text-emerald-300" },
    { key: "rejected", label: "Rejected", value: counts.rejected, icon: XCircle, color: "text-red-300" },
  ];

  return (
    <div className="aurora-page px-4">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-violet-500/30 flex items-center justify-center">
            <Briefcase className="text-cyan-300" />
          </div>
          <div>
            <h1 className="page-title">Manage Jobs</h1>
            <p className="page-subtitle">Approve or reject employer postings.</p>
          </div>
        </div>

        {/* STAT / FILTER TABS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`panel p-5 text-left transition ${
                filter === s.key
                  ? "ring-2 ring-cyan-400/50"
                  : "panel-hover opacity-90"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="muted text-sm">{s.label}</p>
                <s.icon size={18} className={s.color} />
              </div>
              <h2 className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</h2>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="panel p-10 text-center text-slate-400">
            No {filter !== "all" ? filter : ""} jobs found.
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((job) => {
              const status = String(job.status || "pending");
              return (
                <div key={job.id} className="panel panel-hover p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-white">
                        {job.title}
                      </h2>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        {job.company && (
                          <span className="inline-flex items-center gap-1.5 muted">
                            <Building2 size={14} /> {job.company}
                          </span>
                        )}
                        {job.location && (
                          <span className="inline-flex items-center gap-1.5 muted">
                            <MapPin size={14} /> {job.location}
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-sm text-slate-400 mt-3 line-clamp-2">
                          {job.description}
                        </p>
                      )}
                    </div>

                    <span
                      className={`badge shrink-0 ${
                        status === "approved"
                          ? "badge-green"
                          : status === "rejected"
                          ? "badge-red"
                          : "badge-yellow"
                      }`}
                    >
                      {status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10">
                    {status === "pending" ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => approveJob(job.id)}
                          className="btn-success px-5 py-2 rounded-xl font-semibold inline-flex items-center gap-2"
                        >
                          <Check size={16} /> Approve
                        </button>
                        <button
                          onClick={() => rejectJob(job.id)}
                          className="btn-danger px-5 py-2 rounded-xl font-semibold inline-flex items-center gap-2"
                        >
                          <X size={16} /> Reject
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm muted italic">
                        Action already taken — marked as {status}.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

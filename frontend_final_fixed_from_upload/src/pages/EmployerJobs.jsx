import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import API from "../api/api";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await API.get("/jobs/employer/my");
        setJobs(res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to load employer jobs"
        );
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      approved: jobs.filter((j) => j.status === "approved").length,
      pending: jobs.filter((j) => j.status === "pending").length,
      applicants: jobs.reduce((s, j) => s + (j.applicant_count || 0), 0),
    };
  }, [jobs]);

  if (loading) {
    return (
      <div className="aurora-page px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="panel p-6 animate-pulse">
              <div className="h-5 skeleton w-1/3 mb-3" />
              <div className="h-4 skeleton w-1/2 mb-2" />
              <div className="h-10 skeleton w-40" />
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

  const cards = [
    { label: "Total Jobs", value: stats.total, icon: Briefcase, color: "text-cyan-300" },
    { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-emerald-300" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-300" },
    { label: "Applicants", value: stats.applicants, icon: Users, color: "text-violet-300" },
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
            <h1 className="page-title">My Posted Jobs</h1>
            <p className="page-subtitle">Manage your listings &amp; applicants.</p>
          </div>
        </div>

        {/* STATS */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {cards.map((c) => (
              <div key={c.label} className="panel p-5">
                <div className="flex items-center justify-between">
                  <p className="muted text-sm">{c.label}</p>
                  <c.icon size={18} className={c.color} />
                </div>
                <h2 className={`text-3xl font-bold mt-2 ${c.color}`}>
                  {c.value}
                </h2>
              </div>
            ))}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="panel p-10 text-center text-slate-400">
            You haven&apos;t posted any jobs yet.
          </div>
        ) : (
          <div className="space-y-5">
            {jobs.map((job) => (
              <div key={job.id} className="panel panel-hover p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-white">{job.title}</h2>
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
                    <div className="flex gap-3 mt-3">
                      <span className="badge badge-blue">
                        <Users size={12} /> {job.applicant_count || 0} Applicants
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

                  <div className="flex items-center">
                    <Link
                      to={`/employer-applicants/${job.id}`}
                      className="btn-glow px-5 py-2 rounded-xl font-semibold inline-flex items-center gap-2"
                    >
                      View Applicants <ArrowRight size={15} />
                    </Link>
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

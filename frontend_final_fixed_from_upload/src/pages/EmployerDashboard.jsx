import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  Plus,
  ArrowRight,
} from "lucide-react";
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

  if (loading) {
    return (
      <div className="aurora-page px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="panel p-6">
                <div className="skeleton h-4 w-1/2 mb-3" />
                <div className="skeleton h-8 w-1/3" />
              </div>
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="panel p-6">
              <div className="skeleton h-5 w-1/3 mb-3" />
              <div className="skeleton h-4 w-1/2" />
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

  const totalJobs = jobs.length;
  const approved = jobs.filter((j) => j.status === "approved").length;
  const pending = jobs.filter((j) => j.status === "pending").length;
  const totalApplicants = jobs.reduce(
    (sum, j) => sum + (j.applicant_count || 0),
    0
  );

  const cards = [
    { label: "Total Jobs", value: totalJobs, icon: Briefcase, color: "text-cyan-300" },
    { label: "Approved", value: approved, icon: CheckCircle2, color: "text-emerald-300" },
    { label: "Pending", value: pending, icon: Clock, color: "text-amber-300" },
    { label: "Applicants", value: totalApplicants, icon: Users, color: "text-violet-300" },
  ];

  return (
    <div className="aurora-page px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-violet-500/30 flex items-center justify-center">
              <LayoutDashboard className="text-cyan-300" />
            </div>
            <div>
              <h1 className="page-title">Employer Dashboard</h1>
              <p className="page-subtitle">
                Overview of your postings &amp; applicants.
              </p>
            </div>
          </div>
          <Link
            to="/employer-jobs"
            className="btn-glow px-5 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2"
          >
            <Plus size={16} /> Manage Jobs
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="panel panel-hover p-5">
              <div className="flex items-center justify-between">
                <p className="muted text-sm">{c.label}</p>
                <c.icon size={18} className={c.color} />
              </div>
              <h2 className={`text-3xl font-bold mt-2 ${c.color}`}>{c.value}</h2>
            </div>
          ))}
        </div>

        {/* JOB LIST */}
        <h2 className="panel-title mb-4">Recent Job Postings</h2>
        {jobs.length === 0 ? (
          <div className="panel p-10 text-center text-slate-400">
            You haven&apos;t posted any jobs yet.
          </div>
        ) : (
          <div className="space-y-5">
            {jobs.map((job) => (
              <div key={job.id} className="panel panel-hover p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-white">{job.title}</h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5 muted">
                          <MapPin size={14} /> {job.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 muted">
                        <Users size={14} /> {job.applicant_count || 0} applicants
                      </span>
                    </div>
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
                        {job.status || "pending"}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/employer-applicants/${job.id}`}
                    className="btn-soft px-5 py-2 rounded-xl font-semibold inline-flex items-center gap-2 shrink-0"
                  >
                    View Applicants
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

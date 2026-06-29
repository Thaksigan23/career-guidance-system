import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Users,
  ArrowRight,
} from "lucide-react";
import API from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const res = await API.get("/admin/jobs");
        const jobs = res.data || [];
        const counts = { pending: 0, approved: 0, rejected: 0 };
        jobs.forEach((job) => {
          const status = job.status || "pending";
          if (counts[status] !== undefined) counts[status]++;
        });
        setStats(counts);
      } catch {
        setError("Failed to load admin statistics");
      } finally {
        setLoading(false);
      }
    }
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="aurora-page px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="panel p-6">
                <div className="skeleton h-4 w-1/2 mb-3" />
                <div className="skeleton h-8 w-1/3" />
              </div>
            ))}
          </div>
          <div className="panel p-6">
            <div className="skeleton h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aurora-page text-center text-red-300">{error}</div>
    );
  }

  const total = stats.pending + stats.approved + stats.rejected;
  const data = [
    { name: "Pending", value: stats.pending, fill: "#facc15" },
    { name: "Approved", value: stats.approved, fill: "#22c55e" },
    { name: "Rejected", value: stats.rejected, fill: "#ef4444" },
  ];

  const cards = [
    {
      label: "Total Jobs",
      value: total,
      icon: Briefcase,
      color: "text-cyan-300",
      ring: "from-cyan-500/30 to-violet-500/20",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-300",
      ring: "from-amber-500/30 to-amber-500/5",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      color: "text-emerald-300",
      ring: "from-emerald-500/30 to-emerald-500/5",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-300",
      ring: "from-red-500/30 to-red-500/5",
    },
  ];

  return (
    <div className="aurora-page px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-violet-500/30 flex items-center justify-center">
            <ShieldCheck className="text-cyan-300" />
          </div>
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">
              Platform overview of all job postings.
            </p>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="panel panel-hover p-5">
              <div className="flex items-center justify-between">
                <p className="muted text-sm">{c.label}</p>
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.ring} flex items-center justify-center`}
                >
                  <c.icon size={17} className={c.color} />
                </div>
              </div>
              <h2 className={`text-3xl font-bold mt-2 ${c.color}`}>{c.value}</h2>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* BAR CHART */}
          <div className="panel p-6 lg:col-span-2">
            <h2 className="panel-title mb-4">Job Status Overview</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={data}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#94a3b8" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      background: "#14102e",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      color: "#e2e8f0",
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="panel p-6">
            <h2 className="panel-title mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/jobs"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition group"
              >
                <span className="flex items-center gap-3 text-slate-200">
                  <Briefcase size={18} className="text-cyan-300" /> Review Jobs
                </span>
                <ArrowRight
                  size={16}
                  className="text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition"
                />
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition group"
              >
                <span className="flex items-center gap-3 text-slate-200">
                  <Users size={18} className="text-violet-300" /> Manage Users
                </span>
                <ArrowRight
                  size={16}
                  className="text-slate-500 group-hover:text-violet-300 group-hover:translate-x-1 transition"
                />
              </Link>
              {stats.pending > 0 && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                  {stats.pending} job{stats.pending > 1 ? "s" : ""} awaiting your
                  review.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

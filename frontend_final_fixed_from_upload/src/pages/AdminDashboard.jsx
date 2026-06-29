import { useEffect, useState } from "react";
import API from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
    Cell,          // ✅ ADD THIS
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const res = await API.get("/admin/jobs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const jobs = res.data || [];

        // Count statuses
        const counts = {
          pending: 0,
          approved: 0,
          rejected: 0,
        };

        jobs.forEach((job) => {
          const status = job.status || "pending";
          if (counts[status] !== undefined) {
            counts[status]++;
          }
        });

        setStats(counts);
      } catch (err) {
        setError("Failed to load admin statistics");
      } finally {
        setLoading(false);
      }
    }

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="aurora-page text-center text-slate-400">
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="aurora-page text-center text-red-300">
        {error}
      </div>
    );
  }

  // Chart data
  const data = [
  { name: "Pending", value: stats.pending, fill: "#facc15" },   // yellow
  { name: "Approved", value: stats.approved, fill: "#22c55e" }, // green
  { name: "Rejected", value: stats.rejected, fill: "#ef4444" }, // red
];


  return (
    <div className="aurora-page px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="page-title mb-8">Admin Dashboard</h1>

        {/* COUNTER CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="panel p-6 text-center">
            <p className="muted">Pending Jobs</p>
            <h2 className="text-3xl font-bold text-amber-400">
              {stats.pending}
            </h2>
          </div>

          <div className="panel p-6 text-center">
            <p className="muted">Approved Jobs</p>
            <h2 className="text-3xl font-bold text-emerald-400">
              {stats.approved}
            </h2>
          </div>

          <div className="panel p-6 text-center">
            <p className="muted">Rejected Jobs</p>
            <h2 className="text-3xl font-bold text-red-400">
              {stats.rejected}
            </h2>
          </div>
        </div>

        {/* BAR CHART */}
        <div className="panel p-6">
          <h2 className="panel-title mb-4">Job Status Overview</h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
  <BarChart data={data}>
    <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} axisLine={{ stroke: "rgba(255,255,255,0.15)" }} tickLine={false} />
    <YAxis allowDecimals={false} tick={{ fill: "#94a3b8" }} axisLine={{ stroke: "rgba(255,255,255,0.15)" }} tickLine={false} />
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

      </div>
    </div>
  );
}

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
      <div className="page-container center text-gray-600">
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container center text-red-600">
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
    <div className="page-container px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Admin Dashboard
        </h1>

        {/* COUNTER CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="card text-center">
            <p className="text-gray-500">Pending Jobs</p>
            <h2 className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </h2>
          </div>

          <div className="card text-center">
            <p className="text-gray-500">Approved Jobs</p>
            <h2 className="text-3xl font-bold text-green-600">
              {stats.approved}
            </h2>
          </div>

          <div className="card text-center">
            <p className="text-gray-500">Rejected Jobs</p>
            <h2 className="text-3xl font-bold text-red-600">
              {stats.rejected}
            </h2>
          </div>
        </div>

        {/* BAR CHART */}
        <div className="card">
          <h2 className="card-title mb-4">
            Job Status Overview
          </h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
  <BarChart data={data}>
    <XAxis dataKey="name" />
    <YAxis allowDecimals={false} />
    <Tooltip />
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

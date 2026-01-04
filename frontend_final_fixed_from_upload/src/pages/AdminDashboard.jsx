import React from "react";
import { Users, Briefcase, Clock, UserCheck } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Students", value: 120, icon: Users, color: "bg-blue-500" },
    { label: "Total Employers", value: 45, icon: UserCheck, color: "bg-green-500" },
    { label: "Pending Approvals", value: 12, icon: Clock, color: "bg-yellow-500" },
    { label: "Jobs Posted", value: 89, icon: Briefcase, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full text-white ${card.color}`}>
                  <card.icon size={26} />
                </div>
                <div>
                  <p className="text-gray-600">{card.label}</p>
                  <h2 className="text-2xl font-bold">{card.value}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

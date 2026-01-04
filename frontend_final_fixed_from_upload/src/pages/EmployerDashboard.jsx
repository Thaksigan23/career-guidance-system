import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { Briefcase, Users, CheckCircle } from "lucide-react";

export default function EmployerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await API.get("/employer/summary");
        setStats(data);
      } catch (err) {
        console.log("Dashboard error:", err);
      }
      setLoading(false);
    }

    loadStats();
  }, []);

  if (loading)
    return (
      <div className="pt-20 text-center text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );

  return (
    <div className="min-h-screen pt-20 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Employer Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="mx-auto bg-blue-500 p-3 rounded-full text-white w-fit">
              <Briefcase size={26} />
            </div>
            <h2 className="text-xl font-semibold mt-3">Jobs Posted</h2>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {stats.total_jobs}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="mx-auto bg-green-500 p-3 rounded-full text-white w-fit">
              <Users size={26} />
            </div>
            <h2 className="text-xl font-semibold mt-3">Total Applicants</h2>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.total_applicants}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="mx-auto bg-purple-500 p-3 rounded-full text-white w-fit">
              <CheckCircle size={26} />
            </div>
            <h2 className="text-xl font-semibold mt-3">Active Jobs</h2>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {stats.jobs?.length}
            </p>
          </div>
        </div>

        {/* Applicants per Job */}
        <h2 className="text-2xl font-bold mt-12 mb-4">Applicants by Job</h2>

        <div className="space-y-4">
          {stats.jobs?.map((job) => (
            <div
              key={job.job_id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{job.title}</p>
                <p className="text-sm text-gray-600">
                  {job.applicant_count} applicants
                </p>
              </div>

              <Link
                to={`/employer-applicants/${job.job_id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                View Applicants
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

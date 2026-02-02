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
    <div className="bg-white rounded-2xl p-6 shadow animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );

  // 📊 Stats
  const totalJobs = jobs.length;
  const approved = jobs.filter(j => j.status === "approved").length;
  const pending = jobs.filter(j => j.status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
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
      <div className="pt-24 text-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Employer Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your job postings & applicants
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">Total Jobs</p>
            <h2 className="text-3xl font-bold text-indigo-600">
              {totalJobs}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">Approved Jobs</p>
            <h2 className="text-3xl font-bold text-green-600">
              {approved}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">Pending Approval</p>
            <h2 className="text-3xl font-bold text-yellow-500">
              {pending}
            </h2>
          </div>
        </div>

        {/* JOB LIST */}
        {jobs.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-gray-600 text-lg">
              You haven’t posted any jobs yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 shadow-md 
                           hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">

                  {/* LEFT */}
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-600">
                      {job.title}
                    </h2>

                    <p className="text-gray-700 mt-1">
                      {job.company} • {job.location}
                    </p>

                    <div className="flex gap-3 mt-3">
                      <span className="bg-blue-100 text-blue-700 
                                       px-3 py-1 rounded-full text-sm font-semibold">
                        👥 {job.applicant_count} Applicants
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                          ${
                            job.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : job.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
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

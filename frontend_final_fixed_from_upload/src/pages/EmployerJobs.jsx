import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

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

  // 🦴 Skeleton Card
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-6 shadow animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-40"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
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
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            My Posted Jobs
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your job listings & applicants
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-xl shadow">
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

                  {/* RIGHT */}
                  <div className="flex items-center">
                    <Link
                      to={`/employer-applicants/${job.id}`}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 
                                 text-white px-5 py-2 rounded-lg font-semibold
                                 hover:scale-105 transition shadow"
                    >
                      View Applicants →
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

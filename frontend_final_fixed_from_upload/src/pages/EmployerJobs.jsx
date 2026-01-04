import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // LOAD JOBS POSTED BY EMPLOYER
  // --------------------------------
  useEffect(() => {
    API.get("/jobs/my")
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading employer jobs:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="pt-20 text-center text-gray-600">Loading...</div>
    );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-4">
        
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          My Posted Jobs
        </h2>

        {jobs.length === 0 ? (
          <p className="text-gray-600 text-center">
            You haven't posted any jobs yet.
          </p>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-lg card-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-xl font-bold text-blue-600 hover:underline"
                    >
                      {job.title}
                    </Link>

                    <p className="text-gray-700">{job.company}</p>
                    <p className="text-gray-500">{job.location}</p>
                    <p className="text-green-700 font-semibold mt-1">
                      {job.salary || "Not specified"}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      Posted: {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <Link
                    to={`/employer-applicants/${job.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    View Applicants ({job.applicant_count || 0})
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

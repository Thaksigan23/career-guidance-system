import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function EmployerApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // LOAD APPLICANTS FOR THIS JOB
  // -----------------------------
  useEffect(() => {
    async function loadData() {
      try {
        // 1️⃣ Load job details
        const jobRes = await API.get(`/jobs/${jobId}`);
        setJob(jobRes.data);

        // 2️⃣ Load all applicants for this job
        const appsRes = await API.get(`/applications/job/${jobId}`);
        setApplicants(appsRes.data);

        setLoading(false);
      } catch (err) {
        console.log("Error loading applicants:", err);
        setLoading(false);
      }
    }

    loadData();
  }, [jobId]);

  if (loading)
    return (
      <div className="pt-20 text-center text-gray-600">Loading...</div>
    );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-4">
        
        {/* Job Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Applicants for: {job?.title}
        </h2>

        <p className="text-gray-600 mb-8">
          {job?.company} — {job?.location}
        </p>

        {applicants.length === 0 ? (
          <div className="text-center text-gray-600">
            No one has applied yet.
          </div>
        ) : (
          <div className="space-y-6">
            {applicants.map((app) => (
              <div
                key={app.application_id}
                className="bg-white card-shadow rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  {app.full_name}
                </h3>

                <p className="text-gray-600">{app.email}</p>

                <p className="text-gray-500 text-sm mt-1">
                  Applied on: {new Date(app.applied_date).toLocaleDateString()}
                </p>

                <div className="mt-4">
                  <h4 className="font-semibold mb-1">Application Message:</h4>
                  <p className="text-gray-700 bg-gray-100 p-3 rounded-md">
                    {app.message}
                  </p>
                </div>

                <div className="mt-4 flex space-x-3">
                  <a
                    href={`mailto:${app.email}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Contact Applicant
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

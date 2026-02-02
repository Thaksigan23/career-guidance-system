import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function EmployerApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const jobRes = await API.get(`/jobs/${jobId}`);
        setJob(jobRes.data);

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

  // 📧 CONTACT FUNCTION
  function contactApplicant(applicant) {
    const subject = encodeURIComponent(
      `Regarding your application for ${job?.title}`
    );

    const body = encodeURIComponent(
      `Hello ${applicant.full_name},\n\n` +
      `Thank you for applying for the position of "${job?.title}" at ${job?.company}.\n\n` +
      `We would like to discuss your application further.\n\n` +
      `Best regards,\n${job?.company}`
    );

    window.location.href = `mailto:${applicant.email}?subject=${subject}&body=${body}`;
  }

  if (loading)
    return (
      <div className="pt-20 text-center text-gray-600">Loading...</div>
    );

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto py-12 px-4">

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
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  {app.full_name}
                </h3>

                <p className="text-gray-600">{app.email}</p>

                <p className="text-gray-500 text-sm mt-1">
                  Applied on:{" "}
                  {new Date(app.applied_date).toLocaleDateString()}
                </p>

                <div className="mt-4">
                  <h4 className="font-semibold mb-1">
                    Application Message:
                  </h4>
                  <p className="text-gray-700 bg-gray-100 p-3 rounded-md">
                    {app.message}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => contactApplicant(app)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 
                               text-white px-5 py-2 rounded-lg shadow 
                               hover:scale-105 transition"
                  >
                    📧 Contact Applicant
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

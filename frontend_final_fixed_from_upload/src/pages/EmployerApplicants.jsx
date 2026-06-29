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
      <div className="aurora-page text-center text-slate-400">Loading...</div>
    );

  return (
    <div className="aurora-page px-4">
      <div className="max-w-5xl mx-auto">

        <h2 className="page-title mb-2">Applicants for: {job?.title}</h2>

        <p className="page-subtitle mb-8">
          {job?.company} — {job?.location}
        </p>

        {applicants.length === 0 ? (
          <div className="panel p-10 text-center text-slate-400">
            No one has applied yet.
          </div>
        ) : (
          <div className="space-y-6">
            {applicants.map((app) => (
              <div key={app.application_id} className="panel panel-hover p-6">
                <h3 className="text-xl font-bold text-white">
                  {app.full_name}
                </h3>

                <p className="muted">{app.email}</p>

                <p className="text-sm muted mt-1">
                  Applied on: {new Date(app.applied_date).toLocaleDateString()}
                </p>

                <div className="mt-4">
                  <h4 className="font-semibold text-slate-200 mb-1">
                    Application Message:
                  </h4>
                  <p className="text-slate-300 rounded-lg border border-white/10 bg-white/5 p-3">
                    {app.message}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => contactApplicant(app)}
                    className="btn-glow px-5 py-2 rounded-xl font-semibold"
                  >
                    Contact Applicant
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

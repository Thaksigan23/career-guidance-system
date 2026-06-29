import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Users,
  MessageSquare,
  Send,
  MapPin,
  Building2,
} from "lucide-react";
import API from "../api/api";

function avatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=8B5CF6&color=fff&size=80&rounded=true&bold=true`;
}

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
        setApplicants(appsRes.data || []);
      } catch (err) {
        console.log("Error loading applicants:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [jobId]);

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
        <Link
          to="/employer-jobs"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 mb-5"
        >
          <ArrowLeft size={16} /> Back to my jobs
        </Link>

        {/* JOB HEADER */}
        <div className="panel p-6 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {job?.title}
              </h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                {job?.company && (
                  <span className="inline-flex items-center gap-1.5 muted">
                    <Building2 size={14} /> {job.company}
                  </span>
                )}
                {job?.location && (
                  <span className="inline-flex items-center gap-1.5 muted">
                    <MapPin size={14} /> {job.location}
                  </span>
                )}
              </div>
            </div>
            <span className="badge badge-blue">
              <Users size={13} /> {applicants.length} Applicant
              {applicants.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {applicants.length === 0 ? (
          <div className="panel p-10 text-center text-slate-400">
            No one has applied yet.
          </div>
        ) : (
          <div className="space-y-5">
            {applicants.map((app) => (
              <div key={app.application_id} className="panel panel-hover p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={avatar(app.full_name)}
                    alt={app.full_name}
                    className="w-14 h-14 rounded-2xl ring-2 ring-violet-500/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xl font-bold text-white">
                        {app.full_name}
                      </h3>
                      <button
                        onClick={() => contactApplicant(app)}
                        className="btn-glow px-4 py-2 rounded-xl font-semibold inline-flex items-center gap-2 text-sm"
                      >
                        <Send size={15} /> Contact
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-1 text-sm">
                      <span className="inline-flex items-center gap-1.5 muted">
                        <Mail size={14} /> {app.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5 muted">
                        <Calendar size={14} />
                        {new Date(app.applied_date).toLocaleDateString()}
                      </span>
                    </div>

                    {app.message && (
                      <div className="mt-4">
                        <p className="text-xs muted uppercase tracking-wide inline-flex items-center gap-1.5 mb-1.5">
                          <MessageSquare size={13} /> Application Message
                        </p>
                        <p className="text-slate-300 rounded-xl border border-white/10 bg-white/5 p-3 whitespace-pre-line">
                          {app.message}
                        </p>
                      </div>
                    )}
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

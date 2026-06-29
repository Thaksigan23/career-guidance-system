import { useState } from "react";
import API, { downloadCVReport } from "../api/api";
import { applyJob } from "../api/api";

export default function CVAnalysis() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [recommendations, setRecommendations] = useState([]);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [analyzed, setAnalyzed] = useState(false); // ✅ ADD
  const [success, setSuccess] = useState("");

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("cv", file);

      const res = await API.post("/cv/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setRecommendations(res.data?.recommendations || []);
      setAiFeedback(res.data?.ai_feedback || null);
      setAnalyzed(true); // ✅ ADD THIS LINE
      setSuccess("CV analyzed successfully!");

    } catch (err) {
      console.error("CV Analyze Error:", err);
      setError(
        err.response?.data?.error ||
        "CV analysis failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED PDF DOWNLOAD
  const handleDownloadPDF = async () => {
    try {
      const res = await downloadCVReport();

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "cv-analysis-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("PDF download error:", err);
      setError("Failed to download PDF report");
    }
  };
const [appliedJobs, setAppliedJobs] = useState([]);

const handleApply = async (jobId) => {
  try {
    await applyJob(jobId);
    setAppliedJobs(prev => [...prev, jobId]);
    alert("Applied successfully!");
  } catch (err) {
    alert(
      err.response?.data?.error ||
      "Failed to apply for job"
    );
  }
};

  return (
  <div className="aurora-page px-4">
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="page-title">AI CV Analyzer</h1>
        <p className="page-subtitle">
          Upload your CV and get smart job matches powered by AI.
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="panel p-8 mb-6">
        <h2 className="panel-title mb-4">Upload Your CV</h2>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="field file:mr-4 file:rounded-lg file:border-0 file:bg-violet-500/30 file:px-4 file:py-1.5 file:text-violet-100"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-glow px-8 py-2.5 rounded-xl font-semibold whitespace-nowrap disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze CV"}
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 mb-4 text-red-200 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 mb-4 text-emerald-200 font-medium">
          {success}
        </div>
      )}

      {/* RESULTS */}
      {analyzed && (
        <div className="panel p-8">

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
            <h2 className="panel-title text-2xl">Top Job Matches</h2>

            <button
              onClick={handleDownloadPDF}
              className="btn-success px-6 py-2 rounded-xl font-semibold"
            >
              Download PDF Report
            </button>
          </div>

          {/* JOB CARDS */}
          <div className="space-y-5">
            {recommendations.map((job) => (
              <div
                key={job.job_id}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {job.title}
                    </h3>
                    <p className="muted">{job.company}</p>
                  </div>

                  {job.top_match && (
                    <span className="badge badge-green">Top Match</span>
                  )}
                </div>

                <p className="mt-3 font-semibold text-cyan-300">
                  Match Score: {job.match_score}%
                </p>

                {job.improvement_tips?.length > 0 && (
                  <ul className="list-disc ml-6 mt-3 text-slate-300 space-y-1">
                    {job.improvement_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                )}

                {job.top_match && (
                  <button
                    onClick={() => handleApply(job.job_id)}
                    disabled={appliedJobs.includes(job.job_id)}
                    className={`mt-4 px-6 py-2 rounded-xl font-semibold ${
                      appliedJobs.includes(job.job_id)
                        ? "btn-soft opacity-60 cursor-not-allowed"
                        : "btn-glow"
                    }`}
                  >
                    {appliedJobs.includes(job.job_id) ? "Applied" : "Apply Now"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI FEEDBACK */}
      {aiFeedback && Array.isArray(aiFeedback.suggestions) && (
        <div className="mt-8 panel p-6 border-l-4 border-l-amber-400">
          <h3 className="panel-title mb-3 text-amber-300">AI Suggestions</h3>
          <ul className="list-disc ml-6 text-slate-300 space-y-1">
            {aiFeedback.suggestions.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  </div>
);
}


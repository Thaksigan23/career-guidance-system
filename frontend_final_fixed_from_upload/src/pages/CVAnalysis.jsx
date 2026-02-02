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
  <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4">
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-700">
          🤖 AI CV Analyzer
        </h1>
        <p className="text-gray-600 mt-2">
          Upload your CV and get smart job matches powered by AI
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          📄 Upload Your CV
        </h2>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full md:w-auto border border-gray-300 rounded-lg p-2"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-2 rounded-full font-semibold shadow hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "🔍 Analyzing..." : "🚀 Analyze CV"}
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 font-semibold">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 font-semibold">
          ✅ {success}
        </div>
      )}

      {/* RESULTS */}
      {analyzed && (
        <div className="bg-white rounded-2xl shadow-xl p-8">

          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🎯 Top Job Matches
            </h2>

            <button
              onClick={handleDownloadPDF}
              className="mt-3 md:mt-0 bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700"
            >
              📥 Download PDF Report
            </button>
          </div>

          {/* JOB CARDS */}
          <div className="space-y-5">
            {recommendations.map((job) => (
              <div
                key={job.job_id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-700">
                      {job.title}
                    </h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>

                  {job.top_match && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ Top Match
                    </span>
                  )}
                </div>

                <p className="mt-3 font-semibold text-blue-600">
                  Match Score: {job.match_score}%
                </p>

                {job.improvement_tips?.length > 0 && (
                  <ul className="list-disc ml-6 mt-3 text-gray-700">
                    {job.improvement_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                )}

                {job.top_match && (
                  <button
                    onClick={() => handleApply(job.job_id)}
                    disabled={appliedJobs.includes(job.job_id)}
                    className={`mt-4 px-6 py-2 rounded-full font-semibold text-white
                      ${
                        appliedJobs.includes(job.job_id)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {appliedJobs.includes(job.job_id)
                      ? "✔ Applied"
                      : "Apply Now"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI FEEDBACK */}
      {aiFeedback && Array.isArray(aiFeedback.suggestions) && (
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-yellow-700 mb-3">
            💡 AI Suggestions
          </h3>
          <ul className="list-disc ml-6 text-gray-800">
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


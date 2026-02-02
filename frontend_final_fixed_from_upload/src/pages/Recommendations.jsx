import { useState } from "react";
import { getRecommendations, saveJob, applyJob } from "../api/api";
import { useAuth } from "../context/AppContext.jsx";

const Recommendations = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

  // 🔴 IMPORTANT GUARD
  if (!user || !token) {
    return (
      <div className="container">
        <h3>Please login to see job recommendations</h3>
      </div>
    );
  }

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getRecommendations(token);
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
const handleSaveJob = async (job_id) => {
  try {
    const res = await saveJob(job_id);
    setMessage(res.message || "Job saved successfully");
  } catch (error) {
    console.error(error);
    setMessage("Failed to save job");
  }
};
const handleApplyJob = async (job_id) => {
  try {
    const res = await applyJob(job_id);
    setMessage(res.message || "Applied successfully!");
  } catch (error) {
    console.error(error);
    setMessage("Failed to apply for job");
  }
};

  return (
    <div className="container">
      <h2>Job Recommendations</h2>

      <button
  onClick={handleGetRecommendations}
  disabled={loading}
  className="btn-primary"
>
  {loading ? "Finding best jobs..." : "Get Recommendations"}
</button>

{message && (
  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
    {message}
  </div>
)}

      <div className="mt-4">
        
{!loading && jobs.length === 0 && (
  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
    <p className="text-blue-700 font-medium">
      No recommendations found.
    </p>
    <p className="text-sm text-blue-600 mt-1">
      👉 Update your skills in your profile to get better job matches.
    </p>
  </div>
)}

        {jobs.length === 0 && !loading && (
          <p>No recommendations yet. Click the button above.</p>
        )}

        {jobs.length > 0 && (
  <div className="grid gap-4 mt-4">
    {jobs.map((job) => (
      <div
        key={job.id}
        className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.matchScore >= 70
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {job.matchScore}% Match
          </span>
        </div>

        <p className="text-gray-600 mt-1">
          {job.company} • {job.location}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Required Skills: {job.requirements}
        </p>
        <div className="flex gap-3 mt-4">
  <button
    onClick={() => handleApplyJob(job.id)}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    Apply
  </button>

  <button
    onClick={() => handleSaveJob(job.id)}
    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
  >
    Save
  </button>
</div>


      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
};

export default Recommendations;

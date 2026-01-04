import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function JobDetails() {
  const { id } = useParams(); // /jobs/:id
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // LOAD JOB DATA FROM BACKEND
  // ------------------------------
  useEffect(() => {
    API.get(`/jobs/${id}`)
      .then((res) => {
        setJob(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching job:", err);
        setLoading(false);
      });
  }, [id]);

  // ------------------------------
  // APPLY FOR JOB
  // ------------------------------
  async function applyJob() {
    try {
      await API.post("/applications/apply", {
        job_id: id,
        message: "I am applying for this job.",
      });
      alert("Application submitted!");
    } catch (error) {
      console.error(error);
      alert("Failed to apply.");
    }
  }

  // ------------------------------
  // SAVE JOB
  // ------------------------------
  async function saveJob() {
    try {
      await API.post("/saved/save", { job_id: id });
      alert("Job saved!");
    } catch (error) {
      console.error(error);
      alert("Error saving job");
    }
  }

  if (loading)
    return (
      <div className="pt-20 text-center">
        <p>Loading job details...</p>
      </div>
    );

  if (!job)
    return (
      <div className="pt-20 text-center">
        <p>Job not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg card-shadow p-8">

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {job.title}
          </h1>

          {/* Company Section */}
          <div className="mb-6">
            <p className="text-xl text-blue-600">{job.company}</p>
            <p className="text-gray-600">{job.location}</p>
            <p className="text-green-600 font-semibold mt-1">
              {job.salary || "Salary Not Specified"}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">Job Description</h3>
            <p className="text-gray-700">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">Requirements</h3>
            <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={applyJob}
              className="btn-primary text-white font-bold py-2 px-6 rounded-md"
            >
              Apply Now
            </button>

            <button
              onClick={saveJob}
              className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Save Job
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

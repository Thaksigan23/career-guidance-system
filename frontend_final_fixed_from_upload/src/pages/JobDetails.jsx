import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
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
      await API.post("/applications", {
        job_id: id,
        message: "I am applying for this job.",
      });
      toast.success("Application submitted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply.");
    }
  }

  // ------------------------------
  // SAVE JOB
  // ------------------------------
  async function saveJob() {
    try {
      await API.post("/saved", { job_id: id });
      toast.success("Job saved!");
    } catch (error) {
      console.error(error);
      toast.error("Error saving job");
    }
  }

  if (loading)
    return (
      <div className="aurora-page text-center text-slate-400">
        <p>Loading job details...</p>
      </div>
    );

  if (!job)
    return (
      <div className="aurora-page text-center text-slate-400">
        <p>Job not found.</p>
      </div>
    );

  return (
    <div className="aurora-page px-4">
      <div className="max-w-4xl mx-auto">
        <div className="panel p-8">

          {/* Title */}
          <h1 className="page-title mb-4">{job.title}</h1>

          {/* Company Section */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="badge badge-violet">{job.company}</span>
            <span className="badge badge-slate">{job.location}</span>
            <span className="badge badge-green">
              {job.salary || "Salary not specified"}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="panel-title mb-2">Job Description</h3>
            <p className="text-slate-300 leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h3 className="panel-title mb-2">Requirements</h3>
            <p className="text-slate-300 whitespace-pre-line leading-relaxed">
              {job.requirements}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={applyJob}
              className="btn-glow py-2.5 px-7 rounded-xl font-semibold"
            >
              Apply Now
            </button>

            <button
              onClick={saveJob}
              className="btn-soft py-2.5 px-7 rounded-xl font-semibold"
            >
              Save Job
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

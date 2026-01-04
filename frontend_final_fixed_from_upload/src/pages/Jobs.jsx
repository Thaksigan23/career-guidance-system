import { useEffect, useState } from "react";
import API from "../api/api";        
import JobModal from "../components/JobModal";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    API.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.log("Error loading jobs:", err));
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const s = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(s) ||
      job.company.toLowerCase().includes(s) ||
      job.location.toLowerCase().includes(s) ||
      job.description.toLowerCase().includes(s)
    );
  });

  async function applyToJob(jobId) {
    try {
      await API.post("/applications/apply", {
        job_id: jobId,
        message: "I would like to apply for this job.",
      });

      alert("Application submitted successfully!");
    } catch (error) {
      alert("Failed to apply");
      console.log(error);
    }
  }

  async function saveJob(jobId) {
    try {
      await API.post("/saved/save", { job_id: jobId });
      alert("Job saved!");
    } catch (error) {
      alert("Failed to save job");
      console.log(error);
    }
  }

  async function handlePostJob(form) {
  try {
    await API.post("/jobs/post", form);

    alert("Job posted successfully!");

    // Reload jobs from backend
    const { data } = await API.get("/jobs");
    setJobs(data);

    setModalOpen(false);

  } catch (error) {
    console.log(error);
    alert("Failed to post job");
  }
}


  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Job Opportunities</h2>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-white font-bold py-2 px-6 rounded-md"
          >
            Post Job
          </button>
        </div>

        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full mb-6 px-4 py-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No jobs found.</div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white card-shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>

                    {/* FIXED: Job Title Link */}
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-xl font-bold text-blue-600 hover:underline"
                    >
                      {job.title}
                    </Link>

                    <p className="text-lg text-blue-600">{job.company}</p>
                    <p className="text-gray-600">{job.location}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">
                      {job.salary || "Not specified"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Description:
                  </h4>
                  <p className="text-gray-700">{job.description}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Requirements:
                  </h4>
                  <p className="text-gray-700">{job.requirements}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => applyToJob(job.id)}
                    className="btn-primary text-white font-bold py-2 px-4 rounded-md"
                  >
                    Apply Now
                  </button>

                  <button
                    onClick={() => saveJob(job.id)}
                    className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Save for Later
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <JobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handlePostJob}
      />
    </div>
  );
}

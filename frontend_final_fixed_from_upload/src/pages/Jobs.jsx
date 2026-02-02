import { useEffect, useState } from "react";
import API from "../api/api";
import JobModal from "../components/JobModal";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 LOAD USER
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored) user = JSON.parse(stored);
  } catch (e) {
    console.error("Invalid user in storage", e);
  }

  // 📦 LOAD JOBS
  useEffect(() => {
    setLoading(true);
    API.get("/jobs")
      .then((res) => setJobs(res.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  // 🔍 SEARCH
  const filteredJobs = jobs.filter((job) => {
    const s = search.toLowerCase();
    return (
      job.title?.toLowerCase().includes(s) ||
      job.company?.toLowerCase().includes(s) ||
      job.location?.toLowerCase().includes(s)
    );
  });

  // 🧑‍🎓 APPLY
  async function applyToJob(jobId) {
    try {
      await API.post("/applications", {
        job_id: jobId,
        message: "I would like to apply for this job.",
      });
      alert("Application submitted!");
    } catch {
      alert("Failed to apply");
    }
  }

  // 💾 SAVE
  async function saveJob(jobId) {
    try {
      await API.post("/saved", { job_id: jobId });
      alert("Job saved!");
    } catch {
      alert("Failed to save job");
    }
  }

  // 🏢 POST JOB
  async function handlePostJob(form) {
    try {
      await API.post("/jobs", {
        ...form,
        salary: form.salary ? Number(form.salary) : null,
      });
      const { data } = await API.get("/jobs");
      setJobs(data || []);
      setModalOpen(false);
      alert("Job posted!");
    } catch {
      alert("Failed to post job");
    }
  }

  // 🦴 SKELETON CARD
  function SkeletonJobCard() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow animate-pulse">
        <div className="h-6 w-2/3 bg-gray-200 rounded mb-3"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
          <div className="h-9 w-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="max-w-6xl mx-auto py-12">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-800">
              Job Opportunities
            </h2>
            <p className="text-gray-600 mt-1">
              Find your next career move 🚀
            </p>
          </div>

          {user?.role === "employer" && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white font-bold py-2 px-6 rounded-lg shadow 
                         hover:scale-105 transition"
            >
              + Post Job
            </button>
          )}
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search by title, company or location..."
          className="w-full mb-8 px-5 py-3 rounded-xl border shadow 
                     focus:ring-2 focus:ring-indigo-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* JOB LIST */}
        {loading ? (
          <div className="grid gap-6">
            {[...Array(5)].map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 shadow-md 
                           hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row justify-between">

                  {/* LEFT */}
                  <div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-2xl font-bold text-indigo-600 hover:underline"
                    >
                      {job.title}
                    </Link>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {job.company}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        📍 {job.location}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT */}
                  {user?.role === "student" && (
                    <div className="flex gap-3 mt-4 md:mt-0">
                      <button
                        onClick={() => applyToJob(job.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg 
                                   hover:bg-green-600 transition"
                      >
                        Apply
                      </button>

                      <button
                        onClick={() => saveJob(job.id)}
                        className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg 
                                   hover:bg-yellow-200 transition"
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {user?.role === "employer" && (
                    <p className="mt-4 md:mt-0 text-sm text-gray-500 italic">
                      Employers cannot apply
                    </p>
                  )}
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <p className="text-center text-gray-500 text-lg">
                No jobs found 😔
              </p>
            )}
          </div>
        )}

        {/* MODAL */}
        <JobModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handlePostJob}
        />
      </div>
    </div>
  );
}

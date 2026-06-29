import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/api";
import JobModal from "../components/JobModal";
import { Link } from "react-router-dom";
import { Search, MapPin, Building2, Plus, Send, Bookmark } from "lucide-react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored) user = JSON.parse(stored);
  } catch (e) {
    console.error("Invalid user in storage", e);
  }

  useEffect(() => {
    setLoading(true);
    API.get("/jobs")
      .then((res) => setJobs(res.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const s = search.toLowerCase();
    return (
      job.title?.toLowerCase().includes(s) ||
      job.company?.toLowerCase().includes(s) ||
      job.location?.toLowerCase().includes(s)
    );
  });

  async function applyToJob(jobId) {
    try {
      await API.post("/applications", {
        job_id: jobId,
        message: "I would like to apply for this job.",
      });
      toast.success("Application submitted!");
    } catch {
      toast.error("Failed to apply");
    }
  }

  async function saveJob(jobId) {
    try {
      await API.post("/saved", { job_id: jobId });
      toast.success("Job saved!");
    } catch {
      toast.error("Failed to save job");
    }
  }

  async function handlePostJob(form) {
    try {
      await API.post("/jobs", {
        ...form,
        salary: form.salary ? String(form.salary) : null,
      });
      const { data } = await API.get("/jobs");
      setJobs(data || []);
      setModalOpen(false);
      toast.success("Job posted!");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to post job";
      toast.error(msg);
    }
  }

  function SkeletonJobCard() {
    return (
      <div className="panel p-6 animate-pulse">
        <div className="h-6 w-2/3 skeleton mb-3"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-4 w-24 skeleton rounded-full"></div>
          <div className="h-4 w-32 skeleton rounded-full"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-24 skeleton rounded-lg"></div>
          <div className="h-9 w-20 skeleton rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-page px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="page-title">Job Opportunities</h2>
            <p className="page-subtitle">Find your next career move.</p>
          </div>

          {user?.role === "employer" && (
            <button
              onClick={() => setModalOpen(true)}
              className="btn-glow inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-semibold"
            >
              <Plus size={18} />
              Post Job
            </button>
          )}
        </div>

        {/* SEARCH */}
        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, company or location..."
            className="field pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
              <div key={job.id} className="panel panel-hover p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* LEFT */}
                  <div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-2xl font-bold text-white hover:text-cyan-300 transition"
                    >
                      {job.title}
                    </Link>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="badge badge-violet">
                        <Building2 size={14} /> {job.company}
                      </span>
                      <span className="badge badge-slate">
                        <MapPin size={14} /> {job.location}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT */}
                  {user?.role === "student" && (
                    <div className="flex gap-3 items-start">
                      <button
                        onClick={() => applyToJob(job.id)}
                        className="btn-success inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                      >
                        <Send size={16} /> Apply
                      </button>

                      <button
                        onClick={() => saveJob(job.id)}
                        className="btn-soft inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                      >
                        <Bookmark size={16} /> Save
                      </button>
                    </div>
                  )}

                  {user?.role === "employer" && (
                    <p className="text-sm text-slate-500 italic self-center">
                      Employers cannot apply
                    </p>
                  )}
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="panel p-10 text-center text-slate-400">
                No jobs found.
              </div>
            )}
          </div>
        )}

        <JobModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handlePostJob}
        />
      </div>
    </div>
  );
}

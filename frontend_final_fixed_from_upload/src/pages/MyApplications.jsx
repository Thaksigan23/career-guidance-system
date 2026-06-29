import { useEffect, useState } from "react";
import API from "../api/api";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/applications/me")
      .then((res) => {
        setApps(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading applications:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="aurora-page text-center text-slate-400">
        Loading applications...
      </div>
    );

  return (
  <div className="aurora-page px-4">
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="page-title">My Job Applications</h2>
        <p className="page-subtitle">Track all the jobs you&apos;ve applied for.</p>
      </div>

      {/* EMPTY STATE */}
      {apps.length === 0 ? (
        <div className="panel p-10 text-center text-slate-400">
          You haven&apos;t applied to any jobs yet.
        </div>
      ) : (
        <div className="space-y-6">
          {apps.map((app) => (
            <div key={app.id} className="panel panel-hover p-6">
              <div className="flex justify-between items-start gap-4">

                {/* LEFT */}
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {app.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="badge badge-violet">{app.company}</span>
                  </div>

                  <p className="text-sm muted mt-2">
                    Applied on {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* STATUS */}
                <span className="badge badge-blue h-fit">Applied</span>
              </div>

              {/* MESSAGE */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
                <strong className="text-slate-200">Message:</strong>{" "}
                {app.message || "No message provided."}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}

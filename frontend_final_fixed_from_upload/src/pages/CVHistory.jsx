import { useEffect, useState } from "react";
import API from "../api/api";

export default function CVHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/cv/history");
        setHistory(res.data?.history || []);
      } catch (err) {
        console.error("CV History Error:", err);
        setError("Unable to load CV history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="aurora-page text-center text-slate-400">
        Loading CV history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="aurora-page text-center text-red-300">
        {error}
      </div>
    );
  }

  return (
  <div className="aurora-page px-4">
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="page-title">CV Analysis History</h1>
        <p className="page-subtitle">
          Review your past CV analyses and job match results.
        </p>
      </div>

      {/* EMPTY STATE */}
      {history.length === 0 && (
        <div className="panel p-10 text-center text-slate-400">
          No CV analysis history found yet.
        </div>
      )}

      {/* HISTORY LIST */}
      <div className="space-y-6">
        {history.map((item) => {
          let results = [];

          try {
            results = JSON.parse(item.analysis_result);
          } catch (e) {
            console.error("JSON parse error:", e);
          }

          return (
            <div key={item.id} className="panel panel-hover p-6">
              {/* DATE */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm muted">
                  Analyzed on {new Date(item.created_at).toLocaleString()}
                </span>

                <span className="badge badge-violet">
                  {results.length} Matches
                </span>
              </div>

              {/* RESULTS */}
              <div className="space-y-3">
                {results.slice(0, 3).map((job, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div>
                      <p className="font-semibold text-white">{job.title}</p>
                      <p className="text-sm muted">{job.company}</p>
                    </div>

                    <span
                      className={`badge ${
                        job.match_score >= 80
                          ? "badge-green"
                          : job.match_score >= 60
                          ? "badge-yellow"
                          : "badge-red"
                      }`}
                    >
                      {job.match_score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  </div>
);

}

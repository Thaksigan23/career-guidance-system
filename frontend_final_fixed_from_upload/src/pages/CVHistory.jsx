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
      <div className="pt-20 text-center text-gray-600">
        Loading CV history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
  <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-700">
          📊 CV Analysis History
        </h1>
        <p className="text-gray-600 mt-2">
          Review your past CV analyses and job match results
        </p>
      </div>

      {/* EMPTY STATE */}
      {history.length === 0 && (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
          😕 No CV analysis history found yet.
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
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              {/* DATE */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  🕒 Analyzed on{" "}
                  {new Date(item.created_at).toLocaleString()}
                </span>

                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {results.length} Matches
                </span>
              </div>

              {/* RESULTS */}
              <div className="space-y-3">
                {results.slice(0, 3).map((job, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border border-gray-200 rounded-lg p-3"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {job.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {job.company}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full font-bold text-sm
                        ${
                          job.match_score >= 80
                            ? "bg-green-100 text-green-700"
                            : job.match_score >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
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

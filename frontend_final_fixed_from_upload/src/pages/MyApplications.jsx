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
      <div className="pt-20 text-center text-gray-600">
        Loading applications...
      </div>
    );

  return (
  <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-indigo-700">
          📂 My Job Applications
        </h2>
        <p className="text-gray-600 mt-2">
          Track all the jobs you’ve applied for
        </p>
      </div>

      {/* EMPTY STATE */}
      {apps.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
          😕 You haven’t applied to any jobs yet.
        </div>
      ) : (
        <div className="space-y-6">
          {apps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start">

                {/* LEFT */}
                <div>
                  <h3 className="text-2xl font-bold text-blue-700">
                    {app.title}
                  </h3>

                  <p className="text-gray-700 font-medium">
                    🏢 {app.company}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    📅 Applied on{" "}
                    {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* STATUS */}
                <span className="h-fit px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                  Applied
                </span>
              </div>

              {/* MESSAGE */}
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700">
                <strong>📝 Message:</strong>{" "}
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

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
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-4">

        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          My Job Applications
        </h2>

        {apps.length === 0 ? (
          <p className="text-gray-600 text-center">
            You have not applied to any jobs yet.
          </p>
        ) : (
          <div className="space-y-6">
            {apps.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-lg card-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-bold text-blue-600">
                      {app.title}
                    </p>

                    <p className="text-gray-700">{app.company}</p>
                    <p className="text-gray-500 text-sm">
                      Applied on:{" "}
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm font-semibold">
                    Applied
                  </span>
                </div>

                <p className="mt-4 text-gray-700">{app.message || "No message provided."}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

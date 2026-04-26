import { useEffect, useState } from "react";
import API from "../api/api";

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/students/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 text-center text-gray-600 text-lg">
        Loading profile...
      </div>
    );
  }

  // Avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    profile.full_name || "User"
  )}&background=6366F1&color=fff&size=128&rounded=true`;
  const cvLink = profile.cv_url
    ? `${import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") || "http://localhost:5000"}${profile.cv_url}`
    : "";

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <div className="max-w-4xl mx-auto">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-gradient-to-r from-indigo-500 to-green-400 p-1 rounded-full">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-32 h-32 rounded-full bg-white"
              />
            </div>

            <h2 className="text-3xl font-bold mt-4 text-gray-800">
              {profile.full_name || "Student"}
            </h2>

            <p className="text-gray-500">{profile.email}</p>
          </div>

          {/* INFO GRID */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">

            <div className="info-box">
              <p className="label">📞 Phone</p>
              <p className="value">{profile.phone || "Not provided"}</p>
            </div>

            <div className="info-box">
              <p className="label">🏫 Education</p>
              <p className="value">{profile.education || "Not provided"}</p>
            </div>

            {/* ✅ DEGREE ADDED */}
            <div className="info-box">
              <p className="label">🎓 Degree</p>
              <p className="value">{profile.degree || "Not provided"}</p>
            </div>

          </div>

          {/* SKILLS */}
          <div className="mb-8">
            <h3 className="section-title">Skills</h3>

            {profile.skills ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.skills.split(",").map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added</p>
            )}
          </div>

          {/* EXPERIENCE */}
          <div className="mb-10">
            <h3 className="section-title">Experience</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {profile.experience || "No experience added"}
            </p>
          </div>

          {/* CV */}
          <div className="mb-10">
            <h3 className="section-title">CV / Resume</h3>
            {cvLink ? (
              <a
                href={cvLink}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                View Uploaded CV
              </a>
            ) : (
              <p className="text-gray-500">No CV uploaded</p>
            )}
          </div>

          {/* ACTION */}
          <div className="text-center">
            <button
              onClick={() => (window.location.href = "/student-profile")}
              className="bg-gradient-to-r from-indigo-500 to-green-400 
                         text-white font-bold px-8 py-3 rounded-full 
                         shadow-lg hover:scale-105 transition"
            >
              ✏️ Edit Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

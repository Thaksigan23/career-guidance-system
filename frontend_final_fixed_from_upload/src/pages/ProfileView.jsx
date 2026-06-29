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
      <div className="aurora-page text-center text-slate-400 text-lg">
        Loading profile...
      </div>
    );
  }

  // Avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    profile.full_name || "User"
  )}&background=8B5CF6&color=fff&size=128&rounded=true`;
  const cvLink = profile.cv_url
    ? `${import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") || "http://localhost:5000"}${profile.cv_url}`
    : "";

  return (
    <div className="aurora-page px-4">
      <div className="max-w-4xl mx-auto">

        {/* PROFILE CARD */}
        <div className="panel p-8">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-gradient-to-r from-cyan-400 to-violet-500 p-1 rounded-full">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-28 h-28 rounded-full bg-[#0c0a1d]"
              />
            </div>

            <h2 className="page-title mt-4">
              {profile.full_name || "Student"}
            </h2>

            <p className="page-subtitle">{profile.email}</p>
          </div>

          {/* INFO GRID */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm muted">Phone</p>
              <p className="text-white font-semibold mt-1">{profile.phone || "Not provided"}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm muted">Education</p>
              <p className="text-white font-semibold mt-1">{profile.education || "Not provided"}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm muted">Degree</p>
              <p className="text-white font-semibold mt-1">{profile.degree || "Not provided"}</p>
            </div>

          </div>

          {/* SKILLS */}
          <div className="mb-8">
            <h3 className="panel-title mb-3">Skills</h3>

            {profile.skills ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.split(",").map((skill, i) => (
                  <span key={i} className="chip">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted">No skills added</p>
            )}
          </div>

          {/* EXPERIENCE */}
          <div className="mb-10">
            <h3 className="panel-title mb-3">Experience</h3>
            <p className="text-slate-300 whitespace-pre-line leading-relaxed">
              {profile.experience || "No experience added"}
            </p>
          </div>

          {/* CV */}
          <div className="mb-10">
            <h3 className="panel-title mb-3">CV / Resume</h3>
            {cvLink ? (
              <a
                href={cvLink}
                target="_blank"
                rel="noreferrer"
                className="btn-glow inline-block px-5 py-2 rounded-xl font-semibold"
              >
                View Uploaded CV
              </a>
            ) : (
              <p className="muted">No CV uploaded</p>
            )}
          </div>

          {/* ACTION */}
          <div className="text-center">
            <button
              onClick={() => (window.location.href = "/student-profile")}
              className="btn-glow font-semibold px-8 py-3 rounded-xl text-lg"
            >
              Edit Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import API from "../api/api";

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/students/me");
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load profile");
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="pt-20 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen pt-20 bg-gray-50 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">

        <h2 className="text-3xl font-bold mb-6">My Profile</h2>

        <div className="space-y-4">
          <p><strong>Full Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Education:</strong> {profile.education}</p>
          <p><strong>Skills:</strong> {profile.skills}</p>
          <p><strong>Experience:</strong> {profile.experience}</p>
        </div>

        <button
          onClick={() => (window.location.href = "/student-profile")}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </button>

      </div>
    </div>
  );
}

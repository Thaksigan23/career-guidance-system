import { useState } from "react";
import { getCareerPath } from "../api/api";

export default function CareerPath() {
  const [skills, setSkills] = useState("");
  const [careers, setCareers] = useState([]);

  const handleSubmit = async () => {
    const skillArray = skills.split(",").map(s => s.trim());
    const res = await getCareerPath(skillArray);
    setCareers(res.careers);
  };

  return (
    <div className="pt-20 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Career Path Recommendation</h1>

      <input
        type="text"
        placeholder="Enter skills (comma separated)"
        value={skills}
        onChange={e => setSkills(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <button
        onClick={handleSubmit}
        className="btn-primary px-6 py-2"
      >
        Get Career Path
      </button>

      <div className="mt-6 space-y-6">
        {careers.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold">{c.career}</h2>
            <p><b>Next roles:</b> {c.next_roles.join(" → ")}</p>
            <p><b>Skills to learn:</b> {c.skills_to_learn.join(", ")}</p>
            <p><b>Certifications:</b> {c.certifications.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

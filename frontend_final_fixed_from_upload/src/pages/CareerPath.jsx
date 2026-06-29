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
    <div className="aurora-page px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="page-title">Career Path Recommendation</h1>
          <p className="page-subtitle">
            Enter your skills to discover where your career could go.
          </p>
        </div>

        <div className="panel p-6 mb-8">
          <label className="field-label">Your skills (comma separated)</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. JavaScript, React, SQL"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="field"
            />
            <button
              onClick={handleSubmit}
              className="btn-glow px-7 py-2.5 rounded-xl font-semibold whitespace-nowrap"
            >
              Get Career Path
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {careers.map((c, i) => (
            <div key={i} className="panel panel-hover p-6">
              <h2 className="text-xl font-bold text-white mb-3">{c.career}</h2>
              <p className="text-slate-300">
                <span className="text-cyan-300 font-semibold">Next roles:</span>{" "}
                {c.next_roles.join(" → ")}
              </p>
              <p className="text-slate-300 mt-1">
                <span className="text-cyan-300 font-semibold">Skills to learn:</span>{" "}
                {c.skills_to_learn.join(", ")}
              </p>
              <p className="text-slate-300 mt-1">
                <span className="text-cyan-300 font-semibold">Certifications:</span>{" "}
                {c.certifications.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

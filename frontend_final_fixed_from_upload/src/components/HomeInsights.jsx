import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Target, Users, Briefcase } from "lucide-react";
import { getRecommendations, getEmployerSummary } from "../api/api";

// Circular progress gauge (dependency-free SVG).
function Gauge({ value, max = 100, label, suffix = "%" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const r = 46;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 120, height: 120 }}>
        <svg width="120" height="120" className="-rotate-90">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {value}
            <span className="text-sm muted">{suffix}</span>
          </span>
        </div>
      </div>
      <p className="text-xs muted mt-2 text-center">{label}</p>
    </div>
  );
}

// Horizontal bar chart (CSS-based, responsive).
function BarChart({ items, max, accentClass }) {
  const safeMax = max > 0 ? max : 1;
  return (
    <div className="space-y-3 flex-1 min-w-0">
      {items.map((it, i) => {
        const pct = Math.max(4, Math.round((it.value / safeMax) * 100));
        return (
          <div key={i}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-sm text-slate-200 truncate">{it.label}</span>
              <span className="text-xs font-semibold text-white shrink-0">
                {it.display ?? it.value}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-white/8 overflow-hidden">
              <div
                className={`h-full rounded-full ${accentClass}`}
                style={{ width: `${pct}%`, transition: "width 0.8s ease" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
      <Icon size={16} className="text-cyan-400 mx-auto mb-1" />
      <p className="text-xl font-bold text-gradient">{value}</p>
      <p className="text-[11px] muted">{label}</p>
    </div>
  );
}

export default function HomeInsights({ role }) {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (role === "student") {
          const data = await getRecommendations();
          if (active) setStudent(Array.isArray(data) ? data : []);
        } else if (role === "employer") {
          const data = await getEmployerSummary();
          if (active) setEmployer(data);
        }
      } catch {
        if (active) {
          setStudent([]);
          setEmployer(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [role]);

  if (role !== "student" && role !== "employer") return null;

  if (loading) {
    return (
      <div className="panel p-5 mb-6">
        <div className="skeleton h-5 w-1/3 mb-4" />
        <div className="flex gap-6">
          <div className="skeleton h-28 w-28 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- STUDENT ---------------- */
  if (role === "student") {
    let jobs = student || [];
    const isSample = jobs.length === 0;

    // Preview data so the graph is always meaningful (e.g. before skills set).
    if (isSample) {
      jobs = [
        { title: "Senior React Developer", matchScore: 88 },
        { title: "Frontend Engineer", matchScore: 76 },
        { title: "Full-Stack Developer", matchScore: 64 },
        { title: "UI Engineer", matchScore: 57 },
        { title: "Junior Web Developer", matchScore: 45 },
      ];
    }

    const top = [...jobs]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
      .map((j) => ({
        label: j.title,
        value: j.matchScore,
        display: `${j.matchScore}%`,
      }));

    const avg = Math.round(
      jobs.reduce((s, j) => s + (j.matchScore || 0), 0) / jobs.length
    );
    const strong = jobs.filter((j) => j.matchScore >= 70).length;

    return (
      <div className="panel p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="panel-title inline-flex items-center gap-2">
            <BarChart3 size={18} className="text-cyan-400" /> Job Match Insights
            {isSample && <span className="badge badge-slate text-[10px]">Sample</span>}
          </h3>
          <Link to="/recommendations" className="text-xs text-cyan-300">
            View all
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <Gauge value={avg} label="Average match" />
          <BarChart
            items={top}
            max={100}
            accentClass="bg-gradient-to-r from-cyan-400 to-violet-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <Stat icon={Briefcase} value={jobs.length} label="Jobs analyzed" />
          <Stat icon={Target} value={strong} label="Strong matches" />
          <Stat icon={TrendingUp} value={`${avg}%`} label="Avg match" />
        </div>

        {isSample && (
          <p className="text-xs muted mt-4">
            This is sample data. Add your skills in your{" "}
            <Link to="/student-profile" className="text-cyan-300 underline">
              profile
            </Link>{" "}
            to see your real job matches.
          </p>
        )}
      </div>
    );
  }

  /* ---------------- EMPLOYER ---------------- */
  let summary = employer || { total_jobs: 0, total_applicants: 0, jobs: [] };
  let jobList = summary.jobs || [];
  const isSample = jobList.length === 0;

  if (isSample) {
    jobList = [
      { title: "Senior React Developer", applicant_count: 7 },
      { title: "Backend Engineer (Node.js)", applicant_count: 5 },
      { title: "UI/UX Designer", applicant_count: 4 },
      { title: "Data Analyst", applicant_count: 2 },
    ];
    summary = {
      total_jobs: jobList.length,
      total_applicants: jobList.reduce((s, j) => s + j.applicant_count, 0),
      jobs: jobList,
    };
  }

  const top = [...jobList]
    .sort((a, b) => b.applicant_count - a.applicant_count)
    .slice(0, 5)
    .map((j) => ({ label: j.title, value: j.applicant_count }));
  const maxApplicants = Math.max(...jobList.map((j) => j.applicant_count), 1);

  return (
    <div className="panel p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="panel-title inline-flex items-center gap-2">
          <BarChart3 size={18} className="text-cyan-400" /> Hiring Insights
          {isSample && <span className="badge badge-slate text-[10px]">Sample</span>}
        </h3>
        <Link to="/employer-dashboard" className="text-xs text-cyan-300">
          Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <Gauge
          value={summary.total_applicants}
          max={Math.max(summary.total_applicants, summary.total_jobs * 5, 5)}
          label="Total applicants"
          suffix=""
        />
        <BarChart
          items={top}
          max={maxApplicants}
          accentClass="bg-gradient-to-r from-violet-500 to-orange-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <Stat icon={Briefcase} value={summary.total_jobs} label="Jobs posted" />
        <Stat icon={Users} value={summary.total_applicants} label="Applicants" />
      </div>

      {isSample && (
        <p className="text-xs muted mt-4">
          This is sample data. Post jobs to track real applicants here.
        </p>
      )}
    </div>
  );
}

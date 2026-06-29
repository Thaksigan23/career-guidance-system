import { Link } from "react-router-dom";
import {
  Sparkles,
  Target,
  Briefcase,
  FileText,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Career Guidance",
    desc: "Personalized, AI-driven career advice mapped to your skills and ambitions.",
  },
  {
    icon: Briefcase,
    title: "Job Opportunities",
    desc: "Discover curated internships and roles that match your profile in seconds.",
  },
  {
    icon: FileText,
    title: "CV Analysis",
    desc: "Instant, intelligent resume scoring with actionable improvements.",
  },
];

const stats = [
  { value: "10K+", label: "Careers Matched" },
  { value: "2.5K+", label: "Active Jobs" },
  { value: "98%", label: "CV Accuracy" },
  { value: "24/7", label: "AI Support" },
];

export default function Landing() {
  return (
    <div className="gradient-bg min-h-screen pt-28 pb-20">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="grid-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="hero-badge reveal reveal-1">
            <Sparkles size={15} className="text-orange-400" />
            AI-Powered Career Platform
          </span>

          <h1 className="reveal reveal-2 mt-7 text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Build the career you{" "}
            <span className="text-gradient">truly deserve</span>
          </h1>

          <p className="reveal reveal-3 mt-6 text-lg md:text-xl text-slate-300/90 leading-relaxed">
            Smart guidance, tailored job matches, and AI resume analysis —
            everything you need to take the next step, all in one elegant place.
          </p>

          <div className="reveal reveal-4 mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="btn-glow inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="btn-ghost inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg"
            >
              Sign In
            </Link>
          </div>

          <div className="reveal reveal-5 mt-8 flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400" /> No credit card
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400" /> Free forever plan
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400" /> Cancel anytime
            </span>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className={`glass-card reveal reveal-${i + 2} text-left`}>
              <div className="feature-icon">
                <Icon size={26} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-slate-300/85 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* STATS BAND */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-3xl border border-white/10 bg-[#1e1b3a]/40 backdrop-blur-lg py-10 px-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-gradient">
                {value}
              </div>
              <div className="mt-1 text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        {/* CLOSING CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to find your path?
          </h2>
          <p className="mt-3 text-slate-300/85 max-w-xl mx-auto">
            Join thousands of students and professionals shaping their future
            with CareerGuide.
          </p>
          <Link
            to="/register"
            className="btn-glow inline-flex items-center justify-center gap-2 mt-8 px-9 py-4 rounded-xl font-semibold text-lg"
          >
            Create your account
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Building2,
  Sparkles,
  ThumbsUp,
  UserPlus,
  UserCheck,
  Clock,
  Users,
  FileText,
  Download,
  BadgeCheck,
} from "lucide-react";
import {
  getPublicProfile,
  getConnectionStatus,
  sendConnectionRequest,
  respondConnection,
  endorseSkill,
  removeEndorsement,
} from "../api/api";

function avatar(name, size = 160) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=8B5CF6&color=fff&size=${size}&rounded=true&bold=true`;
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [conn, setConn] = useState({ status: "none" });
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [p, c] = await Promise.all([
        getPublicProfile(id),
        getConnectionStatus(id),
      ]);
      setProfile(p);
      setConn(c);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="aurora-page text-center text-slate-400 text-lg">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="aurora-page text-center text-slate-400 text-lg">
        Profile not found.
      </div>
    );
  }

  const isStudent = profile.role === "student";
  const skills = profile.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const cvLink = profile.cv_url
    ? `${
        import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") ||
        "http://localhost:5000"
      }${profile.cv_url}`
    : "";

  async function handleConnect() {
    try {
      await sendConnectionRequest(id);
      setConn({ status: "pending_outgoing" });
      toast.success("Connection request sent");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not connect");
    }
  }

  async function handleAccept() {
    try {
      await respondConnection(conn.connection_id, "accept");
      setConn({ status: "connected" });
      toast.success("Connection accepted");
      load();
    } catch {
      toast.error("Action failed");
    }
  }

  async function toggleEndorse(skill) {
    const current = profile.endorsements[skill] || { count: 0, mine: false };
    const next = !current.mine;
    setProfile((prev) => ({
      ...prev,
      endorsements: {
        ...prev.endorsements,
        [skill]: {
          count: current.count + (next ? 1 : -1),
          mine: next,
        },
      },
    }));
    try {
      if (next) await endorseSkill(id, skill);
      else await removeEndorsement(id, skill);
    } catch {
      toast.error("Action failed");
      load();
    }
  }

  function ConnectButton() {
    if (conn.status === "self") {
      return (
        <button
          onClick={() => navigate("/profile")}
          className="btn-soft inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
        >
          View as me
        </button>
      );
    }
    if (conn.status === "connected") {
      return (
        <span className="badge badge-green px-4 py-2 text-sm">
          <UserCheck size={15} /> Connected
        </span>
      );
    }
    if (conn.status === "pending_outgoing") {
      return (
        <span className="badge badge-yellow px-4 py-2 text-sm">
          <Clock size={15} /> Request pending
        </span>
      );
    }
    if (conn.status === "pending_incoming") {
      return (
        <button
          onClick={handleAccept}
          className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
        >
          <UserCheck size={16} /> Accept request
        </button>
      );
    }
    return (
      <button
        onClick={handleConnect}
        className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
      >
        <UserPlus size={16} /> Connect
      </button>
    );
  }

  return (
    <div className="aurora-page px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="panel overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-orange-500/20 relative">
            <div className="absolute inset-0 grid-overlay opacity-40" />
          </div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-16">
              <div className="bg-gradient-to-r from-cyan-400 to-violet-500 p-1 rounded-2xl shadow-xl w-fit">
                <img
                  src={avatar(profile.full_name)}
                  alt="Avatar"
                  className="w-32 h-32 rounded-2xl bg-[#0c0a1d]"
                />
              </div>

              <div className="flex-1 md:pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold text-white">
                    {profile.full_name}
                  </h2>
                  <span
                    className={`badge ${
                      isStudent ? "badge-violet" : "badge-blue"
                    }`}
                  >
                    {isStudent ? (
                      <GraduationCap size={14} />
                    ) : (
                      <Building2 size={14} />
                    )}{" "}
                    {profile.role}
                  </span>
                  {profile.open_to_work && (
                    <span className="badge badge-green">
                      <BadgeCheck size={14} /> Open to work
                    </span>
                  )}
                </div>

                {profile.headline && (
                  <p className="text-slate-200 mt-1.5">{profile.headline}</p>
                )}

                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1.5 muted">
                      <MapPin size={15} /> {profile.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 muted">
                    <Users size={15} /> {profile.connection_count} connections
                  </span>
                  <span className="inline-flex items-center gap-1.5 muted">
                    <Mail size={15} /> {profile.email}
                  </span>
                  {profile.phone && (
                    <span className="inline-flex items-center gap-1.5 muted">
                      <Phone size={15} /> {profile.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="self-start md:self-auto md:pb-2">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        {profile.about && (
          <div className="panel p-6">
            <h3 className="panel-title mb-3">About</h3>
            <p className="text-slate-300 whitespace-pre-line leading-relaxed">
              {profile.about}
            </p>
          </div>
        )}

        {/* EMPLOYER COMPANY */}
        {!isStudent && (profile.company || profile.position) && (
          <div className="panel p-6">
            <h3 className="panel-title mb-3 inline-flex items-center gap-2">
              <Building2 size={18} className="text-cyan-400" /> Company
            </h3>
            <p className="text-white font-medium">
              {profile.position ? `${profile.position} at ` : ""}
              {profile.company || "—"}
            </p>
          </div>
        )}

        {/* SKILLS + ENDORSEMENTS */}
        {isStudent && skills.length > 0 && (
          <div className="panel p-6">
            <h3 className="panel-title mb-4 inline-flex items-center gap-2">
              <Sparkles size={18} className="text-orange-400" /> Skills &
              Endorsements
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => {
                const e = profile.endorsements[skill] || {
                  count: 0,
                  mine: false,
                };
                const canEndorse = conn.status !== "self";
                return (
                  <div
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-3 pr-1.5 py-1"
                  >
                    <span className="text-sm text-slate-200">{skill}</span>
                    {e.count > 0 && (
                      <span className="text-xs muted">{e.count}</span>
                    )}
                    {canEndorse && (
                      <button
                        onClick={() => toggleEndorse(skill)}
                        title={e.mine ? "Remove endorsement" : "Endorse"}
                        className={`rounded-full p-1.5 transition ${
                          e.mine
                            ? "bg-cyan-500/30 text-cyan-200"
                            : "bg-white/5 text-slate-400 hover:text-cyan-300"
                        }`}
                      >
                        <ThumbsUp size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        <div className="panel p-6">
          <h3 className="panel-title mb-4 inline-flex items-center gap-2">
            <Briefcase size={18} className="text-cyan-400" /> Experience
          </h3>
          {profile.experiences.length === 0 ? (
            <p className="muted">No experience listed.</p>
          ) : (
            <div className="space-y-5">
              {profile.experiences.map((x) => (
                <div key={x.id} className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Briefcase size={18} className="text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{x.title}</p>
                    {x.company && (
                      <p className="text-slate-300 text-sm">{x.company}</p>
                    )}
                    <p className="text-xs muted mt-0.5">
                      {[x.start_date, x.end_date || "Present"]
                        .filter(Boolean)
                        .join(" — ")}
                      {x.location ? ` · ${x.location}` : ""}
                    </p>
                    {x.description && (
                      <p className="text-slate-300 text-sm mt-1.5 whitespace-pre-line">
                        {x.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDUCATION */}
        <div className="panel p-6">
          <h3 className="panel-title mb-4 inline-flex items-center gap-2">
            <GraduationCap size={18} className="text-violet-400" /> Education
          </h3>
          {profile.education_entries.length === 0 ? (
            <p className="muted">No education listed.</p>
          ) : (
            <div className="space-y-5">
              {profile.education_entries.map((x) => (
                <div key={x.id} className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <GraduationCap size={18} className="text-violet-300" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{x.school}</p>
                    {(x.degree || x.field) && (
                      <p className="text-slate-300 text-sm">
                        {[x.degree, x.field].filter(Boolean).join(", ")}
                      </p>
                    )}
                    <p className="text-xs muted mt-0.5">
                      {[x.start_year, x.end_year].filter(Boolean).join(" — ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CV */}
        {isStudent && cvLink && (
          <div className="panel p-6">
            <h3 className="panel-title mb-4 inline-flex items-center gap-2">
              <FileText size={18} className="text-violet-400" /> CV / Resume
            </h3>
            <a
              href={cvLink}
              target="_blank"
              rel="noreferrer"
              className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
            >
              <Download size={16} /> View CV
            </a>
          </div>
        )}

        {/* ACTIVITY */}
        {profile.posts.length > 0 && (
          <div className="panel p-6">
            <h3 className="panel-title mb-4">Recent activity</h3>
            <div className="space-y-4">
              {profile.posts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs muted mb-1">{timeAgo(p.created_at)}</p>
                  <p className="text-slate-200 whitespace-pre-line">
                    {p.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

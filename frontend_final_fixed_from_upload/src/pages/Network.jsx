import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus, Check, X, Users, UserMinus } from "lucide-react";
import {
  getConnections,
  getPendingRequests,
  getConnectionSuggestions,
  respondConnection,
  sendConnectionRequest,
  removeConnection,
} from "../api/api";

function avatar(name, size = 56) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=8B5CF6&color=fff&size=${size * 2}&rounded=true&bold=true`;
}

function roleBadge(role) {
  if (role === "employer") return "badge badge-blue";
  if (role === "admin") return "badge badge-violet";
  return "badge badge-green";
}

function PersonCard({ person, children }) {
  return (
    <div className="panel p-5 flex flex-col items-center text-center">
      <Link to={`/u/${person.id}`}>
        <img
          src={avatar(person.full_name)}
          alt={person.full_name}
          className="w-20 h-20 rounded-full ring-2 ring-violet-500/40 mb-3"
        />
      </Link>
      <Link
        to={`/u/${person.id}`}
        className="font-semibold text-white hover:text-cyan-300"
      >
        {person.full_name}
      </Link>
      <span className={`${roleBadge(person.role)} mt-2`}>{person.role}</span>
      <div className="mt-4 w-full flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default function Network() {
  const [pending, setPending] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentIds, setSentIds] = useState([]);

  async function load() {
    try {
      const [p, c, s] = await Promise.all([
        getPendingRequests(),
        getConnections(),
        getConnectionSuggestions(),
      ]);
      setPending(p || []);
      setConnections(c || []);
      setSuggestions(s || []);
    } catch {
      toast.error("Failed to load network");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function respond(connectionId, action) {
    try {
      await respondConnection(connectionId, action);
      toast.success(action === "accept" ? "Connection accepted" : "Request declined");
      load();
    } catch {
      toast.error("Action failed");
    }
  }

  async function connect(userId) {
    try {
      await sendConnectionRequest(userId);
      setSentIds((prev) => [...prev, userId]);
      toast.success("Request sent");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not send request");
    }
  }

  async function disconnect(userId) {
    if (!window.confirm("Remove this connection?")) return;
    try {
      await removeConnection(userId);
      toast.success("Connection removed");
      load();
    } catch {
      toast.error("Action failed");
    }
  }

  if (loading) {
    return (
      <div className="aurora-page text-center text-slate-400 text-lg">
        Loading network...
      </div>
    );
  }

  return (
    <div className="aurora-page px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Users className="text-cyan-400" /> My Network
          </h1>
          <p className="page-subtitle">
            Grow your professional circle of students and employers.
          </p>
        </div>

        {/* PENDING REQUESTS */}
        {pending.length > 0 && (
          <section>
            <h2 className="panel-title mb-4">
              Invitations ({pending.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pending.map((p) => (
                <PersonCard key={p.connection_id} person={p}>
                  <button
                    onClick={() => respond(p.connection_id, "accept")}
                    className="btn-glow font-semibold py-2 rounded-xl inline-flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Accept
                  </button>
                  <button
                    onClick={() => respond(p.connection_id, "reject")}
                    className="btn-soft font-semibold py-2 rounded-xl inline-flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Ignore
                  </button>
                </PersonCard>
              ))}
            </div>
          </section>
        )}

        {/* SUGGESTIONS */}
        <section>
          <h2 className="panel-title mb-4">People you may know</h2>
          {suggestions.length === 0 ? (
            <div className="panel p-8 text-center muted">
              No suggestions right now.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {suggestions.map((s) => (
                <PersonCard key={s.id} person={s}>
                  {sentIds.includes(s.id) ? (
                    <button
                      disabled
                      className="btn-soft font-semibold py-2 rounded-xl opacity-60"
                    >
                      Request sent
                    </button>
                  ) : (
                    <button
                      onClick={() => connect(s.id)}
                      className="btn-glow font-semibold py-2 rounded-xl inline-flex items-center justify-center gap-2"
                    >
                      <UserPlus size={16} /> Connect
                    </button>
                  )}
                </PersonCard>
              ))}
            </div>
          )}
        </section>

        {/* CONNECTIONS */}
        <section>
          <h2 className="panel-title mb-4">
            Your connections ({connections.length})
          </h2>
          {connections.length === 0 ? (
            <div className="panel p-8 text-center muted">
              You have no connections yet. Send a few requests above!
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {connections.map((c) => (
                <PersonCard key={c.connection_id} person={c}>
                  <Link
                    to={`/u/${c.id}`}
                    className="btn-soft font-semibold py-2 rounded-xl text-center"
                  >
                    View profile
                  </Link>
                  <button
                    onClick={() => disconnect(c.id)}
                    className="text-sm text-slate-400 hover:text-red-400 inline-flex items-center justify-center gap-1.5 py-1"
                  >
                    <UserMinus size={14} /> Remove
                  </button>
                </PersonCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

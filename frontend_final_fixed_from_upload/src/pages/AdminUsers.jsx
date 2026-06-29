import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Search,
  GraduationCap,
  Building2,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import API from "../api/api";

function avatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=8B5CF6&color=fff&size=64&rounded=true&bold=true`;
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const blockUser = async (id) => {
    if (!window.confirm("Block this user?")) return;
    try {
      await API.put(`/admin/users/${id}/block`, {});
      toast.success("User blocked");
      fetchUsers();
    } catch {
      toast.error("Failed to block user");
    }
  };

  const unblockUser = async (id) => {
    try {
      await API.put(`/admin/users/${id}/unblock`, {});
      toast.success("User unblocked");
      fetchUsers();
    } catch {
      toast.error("Failed to unblock user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("This will permanently delete the user. Continue?"))
      return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const counts = useMemo(() => {
    return {
      total: users.length,
      students: users.filter((u) => u.role === "student").length,
      employers: users.filter((u) => u.role === "employer").length,
      blocked: users.filter((u) => u.status === "blocked").length,
    };
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [users, roleFilter, query]);

  if (loading) {
    return (
      <div className="aurora-page px-4">
        <div className="max-w-6xl mx-auto panel p-6">
          <table className="w-full">
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 skeleton w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aurora-page text-center text-red-300 text-lg">{error}</div>
    );
  }

  const stats = [
    { label: "Total Users", value: counts.total, icon: Users, color: "text-cyan-300" },
    { label: "Students", value: counts.students, icon: GraduationCap, color: "text-emerald-300" },
    { label: "Employers", value: counts.employers, icon: Building2, color: "text-sky-300" },
    { label: "Blocked", value: counts.blocked, icon: Ban, color: "text-red-300" },
  ];

  const roles = ["all", "student", "employer", "admin"];

  return (
    <div className="aurora-page px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-violet-500/30 flex items-center justify-center">
            <Users className="text-cyan-300" />
          </div>
          <div>
            <h1 className="page-title">Manage Users</h1>
            <p className="page-subtitle">Freeze, activate or remove accounts.</p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="panel p-5">
              <div className="flex items-center justify-between">
                <p className="muted text-sm">{s.label}</p>
                <s.icon size={18} className={s.color} />
              </div>
              <h2 className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition border ${
                  roleFilter === r
                    ? "bg-white/15 text-white border-white/20"
                    : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="panel overflow-x-auto">
          <table className="aurora-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400">
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={avatar(user.full_name)}
                          alt={user.full_name}
                          className="w-9 h-9 rounded-full ring-1 ring-white/10"
                        />
                        <div>
                          <p className="font-medium text-white">
                            {user.full_name || "—"}
                          </p>
                          <p className="text-xs muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "admin"
                            ? "badge-violet"
                            : user.role === "employer"
                            ? "badge-blue"
                            : "badge-green"
                        }`}
                      >
                        {user.role === "admin" && <ShieldCheck size={12} />}
                        {user.role === "employer" && <Building2 size={12} />}
                        {user.role === "student" && <GraduationCap size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.status === "blocked" ? "badge-red" : "badge-green"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="text-sm muted">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {user.status === "active" ? (
                          <button
                            onClick={() => blockUser(user.id)}
                            className="btn-danger px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1.5"
                          >
                            <Ban size={14} /> Block
                          </button>
                        ) : (
                          <button
                            onClick={() => unblockUser(user.id)}
                            className="btn-success px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={14} /> Unblock
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="btn-soft px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1.5"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

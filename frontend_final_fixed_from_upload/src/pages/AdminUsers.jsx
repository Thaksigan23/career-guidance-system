import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // LOAD USERS
  // ===============================
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data || []);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===============================
  // ACTIONS
  // ===============================
  const blockUser = async (id) => {
    if (!window.confirm("Block this user?")) return;

    try {
      await API.put(
        `/admin/users/${id}/block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchUsers();
    } catch {
      alert("Failed to block user");
    }
  };

  const unblockUser = async (id) => {
    try {
      await API.put(
        `/admin/users/${id}/unblock`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchUsers();
    } catch {
      alert("Failed to unblock user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("This will permanently delete the user. Continue?"))
      return;

    try {
      await API.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  // ===============================
  // SKELETON ROW
  // ===============================
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 skeleton w-full"></div>
        </td>
      ))}
    </tr>
  );

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <div className="aurora-page px-4">
        <div className="max-w-6xl mx-auto panel p-6">
          <table className="w-full">
            <tbody>
              {[...Array(6)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ===============================
  // ERROR STATE
  // ===============================
  if (error) {
    return (
      <div className="aurora-page text-center text-red-300 text-lg">
        {error}
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="aurora-page px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="page-title">Admin — Manage Users</h1>
          <p className="page-subtitle">Freeze or activate user accounts.</p>
        </div>

        {/* TABLE */}
        <div className="panel overflow-x-auto">
          <table className="aurora-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium text-white">
                      {user.full_name || "—"}
                    </td>

                    <td className="muted">{user.email}</td>

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
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          user.status === "blocked"
                            ? "badge-red"
                            : "badge-green"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="text-sm muted">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="flex gap-2">
                        {user.status === "active" ? (
                          <button
                            onClick={() => blockUser(user.id)}
                            className="btn-danger px-4 py-1.5 rounded-lg font-medium"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => unblockUser(user.id)}
                            className="btn-success px-4 py-1.5 rounded-lg font-medium"
                          >
                            Unblock
                          </button>
                        )}

                        <button
                          onClick={() => deleteUser(user.id)}
                          className="btn-soft px-4 py-1.5 rounded-lg font-medium"
                        >
                          Delete
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

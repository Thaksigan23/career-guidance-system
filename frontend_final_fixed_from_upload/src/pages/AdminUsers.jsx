import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔁 LOAD USERS
  async function fetchUsers() {
    try {
      const res = await API.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data || []);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔒 BLOCK USER
  async function blockUser(id) {
    if (!window.confirm("Block this user?")) return;

    try {
      await API.put(`/admin/users/${id}/block`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
    } catch {
      alert("Failed to block user");
    }
  }

  // 🔓 UNBLOCK USER
  async function unblockUser(id) {
    try {
      await API.put(`/admin/users/${id}/unblock`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
    } catch {
      alert("Failed to unblock user");
    }
  }

  // ❌ DELETE USER
  async function deleteUser(id) {
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
  }

  // 🦴 SKELETON ROW
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
      <td className="p-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
      <td className="p-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="p-4"><div className="h-8 bg-gray-200 rounded w-32"></div></td>
    </tr>
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-100 to-slate-200 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
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

  if (error) {
    return (
      <div className="pt-24 text-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Admin – Manage Users
          </h1>
          <p className="text-gray-600 mt-1">
            Control platform users, roles and access
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Joined</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">
                      {user.full_name || "—"}
                    </td>

                    <td className="p-4 text-gray-600">
                      {user.email}
                    </td>

                    {/* ROLE */}
                    <td className="p-4">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold
                          ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "employer"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold
                          ${
                            user.status === "blocked"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 flex gap-2">
                      {user.status === "active" ? (
                        <button
                          onClick={() => blockUser(user.id)}
                          className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => unblockUser(user.id)}
                          className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 transition"
                        >
                          Unblock
                        </button>
                      )}

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
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

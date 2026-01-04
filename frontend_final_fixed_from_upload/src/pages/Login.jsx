import { useState } from "react";
import API from "../api/api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      // Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");

      // Redirect based on user type
      if (res.data.user.role === "student") {
        window.location.href = "/student-profile";
      } else {
        window.location.href = "/employer-profile";
      }

    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 flex justify-center px-4">
      <div className="bg-white p-8 rounded-lg card-shadow max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Email</label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="w-full border px-3 py-2 mb-4 rounded"
            required
          />

          <label className="block mb-2">Password</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="w-full border px-3 py-2 mb-4 rounded"
            required
          />

          <button className="btn-primary w-full py-2 text-white font-bold rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

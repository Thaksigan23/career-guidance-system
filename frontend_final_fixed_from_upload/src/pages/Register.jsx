import { useState } from "react";
import API from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // student or employer
    phone: "",       // optional
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Correct: send "name", NOT "full_name"
      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
      });

      alert("Account created successfully!");

      // Store token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect
      if (form.role === "student") {
        window.location.href = "/student-profile";
      } else {
        window.location.href = "/employer-profile";
      }
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 flex justify-center px-4">
      <div className="bg-white p-8 rounded-lg card-shadow max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <label className="block mb-2">Full Name</label>
          <input
            name="name"
            onChange={handleChange}
            className="w-full border px-3 py-2 mb-4 rounded"
            required
          />

          {/* Email */}
          <label className="block mb-2">Email</label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="w-full border px-3 py-2 mb-4 rounded"
            required
          />

          {/* Password */}
          <label className="block mb-2">Password</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="w-full border px-3 py-2 mb-4 rounded"
            required
          />

          {/* Account Type */}
          <label className="block mb-2">Account Type</label>
          <select
            name="role"
            onChange={handleChange}
            className="w-full border px-3 py-2 mb-4 rounded"
          >
            <option value="student">Student</option>
            <option value="employer">Employer</option>
          </select>

          <button className="btn-primary w-full py-2 text-white font-bold rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

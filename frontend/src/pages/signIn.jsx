import React, { useState } from "react";
import { authService } from "../services/api";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.login(form);
      navigate("/chat"); // Redirect to ChatPage
    } catch (err) {
      setError(err.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full mb-6 px-3 py-2 border rounded"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
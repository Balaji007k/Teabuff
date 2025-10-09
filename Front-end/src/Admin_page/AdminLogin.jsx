import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./assets_Admin/AdminLogin.css"; // optional, your own CSS
import ApiService from "../components/Service/ApiService/product-api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    const AdminData = {username,password};

    try {

      const { Result, Error } = await ApiService.fetchData(`/api/admin/login`,"POST",AdminData);

      setLoading(false);

      if (Result) {
        // Save token or admin info
        localStorage.setItem("adminToken", Result?.message);
        navigate("/Admin"); // redirect to admin dashboard
      } else {
        setError(Result.message || "Invalid credentials");
      }
    } catch (err) {
      setLoading(false);
      setError("Server error. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="admin-login-container d-flex justify-content-center align-items-center vh-100">
      <div className="admin-login-box p-4 shadow rounded">
        <h2 className="text-center mb-4">Admin Login</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

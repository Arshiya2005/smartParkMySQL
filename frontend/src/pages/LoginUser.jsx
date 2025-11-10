import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import socket from "../socket";
import BackgroundImg from "../assets/green_back.jpg";
const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log(BASE_URL);
const LoginUser = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "customer";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`🚀 Attempting login as ${type} with:`, form);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Login response received:", data);
        localStorage.setItem("token", data.token || "");
        alert("Login successful!");
        console.log("👤 Raw user object from response:", data.user);

        const userId = data.user?.id || data.user?._id;
        if (type === "customer" && userId) {
          socket.connect();
          console.log(`🔌 Socket connected & user registered: ${userId}`);
          socket.emit("register-user", userId);
        }

        navigate(`/${type}`);
      } else {
        console.warn("❌ Login failed:", data.error);
        alert(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Something went wrong.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google?type=${type}`;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        className="container shadow-lg"
        style={{
          maxWidth: "500px",
          backgroundColor: "rgba(255,255,255,0.88)",
          padding: "2rem",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4">
          Login as{" "}
          {type === "owner"
            ? "Owner"
            : type === "admin"
            ? "Admin"
            : "User"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username (Email)"
            className="form-control mb-3"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="btn w-100 mb-3"
            style={{
              backgroundColor: "#2C786C",
              color: "#fff",
              fontWeight: "500",
            }}
          >
            Login
          </button>

          <div className="text-center mb-3">
            Not registered?{" "}
            <Link to={`/signup?type=${type}`}>Sign up now!</Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LoginUser;
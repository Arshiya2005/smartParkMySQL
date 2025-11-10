import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BackgroundImg from "../assets/green_back.jpg";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const SignUpUser = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    secret: "",
    contact: "",
    bankName: "",
    ifsc: "",
    accountNumber: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "customer";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match.");
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      password: form.password,
      type: type,
    };

    if (type === "admin") {
      payload.secret = form.secret;
    }

    if (type === "owner") {
      payload.contact = form.contact;
      payload.bank_account = {
        name: form.bankName,
        ifsc: form.ifsc,
        account_number: form.accountNumber,
      };
    }

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful!");
        navigate(`/login?type=${type}`);
      } else {
        alert(data.error || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong.");
    }
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
          Create a {type === "owner" ? "Owner" : type === "admin" ? "Admin" : "User"} Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="row g-2 mb-3">
            <div className="col">
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="First Name"
                required
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Last Name"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <input
            type="text"
            name="username"
            className="form-control mb-3"
            placeholder="Username (Email)"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            className="form-control mb-3"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            className="form-control mb-3"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
          />

          {type === "admin" && (
            <input
              type="text"
              name="secret"
              className="form-control mb-3"
              placeholder="Admin Secret Key"
              required
              onChange={handleChange}
            />
          )}

          {type === "owner" && (
            <>
              <input
                type="tel"
                name="contact"
                className="form-control mb-3"
                placeholder="Phone Number"
                required
                onChange={handleChange}
              />

              <input
                type="text"
                name="bankName"
                className="form-control mb-3"
                placeholder="Account Holder Name"
                required
                onChange={handleChange}
              />

              <input
                type="text"
                name="ifsc"
                className="form-control mb-3"
                placeholder="IFSC Code"
                required
                onChange={handleChange}
              />

              <input
                type="text"
                name="accountNumber"
                className="form-control mb-3"
                placeholder="Account Number"
                required
                onChange={handleChange}
              />
            </>
          )}

          <button
            className="btn w-100"
            style={{ backgroundColor: "#2C786C", color: "#fff" }}
            type="submit"
          >
            Sign Up
          </button>

          <div className="text-center mt-3">
            Already have an account?{" "}
            <Link to={`/login?type=${type}`}>Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpUser;
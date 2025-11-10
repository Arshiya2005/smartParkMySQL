import React from "react";
import { Link } from "react-router-dom";
import NavbarLanding from "../components/NavbarLanding";

const Terms = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <NavbarLanding />

      <div className="container py-5">
        <h2 className="mb-4">Terms of Use</h2>
        <p>
          By using SmartPark, you agree to abide by all rules and regulations
          laid out on this platform.
        </p>
        <p>
          Users must provide accurate information and may not misuse parking slots.
          Violations may result in suspension or permanent removal of account access.
        </p>
        <p>
          Owners must honor bookings and keep their parking areas safe and accessible.
        </p>
        <p>
          SmartPark reserves the right to update these terms at any time. Users
          are encouraged to check this page periodically for changes.
        </p>

        <div className="mt-5">
          <Link to="/" className="btn btn-secondary">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
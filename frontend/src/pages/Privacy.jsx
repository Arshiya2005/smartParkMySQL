import React from "react";
import { Link } from "react-router-dom";
import NavbarLanding from "../components/NavbarLanding";

const Privacy = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <NavbarLanding />

      <div className="container py-5">
        <h2 className="mb-4">Privacy Policy</h2>
        <p>
          At SmartPark, your privacy is our priority. We collect only essential
          user data such as name, contact details, and location for booking purposes.
        </p>
        <p>
          We never share your personal information with third parties without your consent.
          All data is stored securely and used only to improve your experience.
        </p>
        <p>
          By using our platform, you consent to our privacy practices. You may contact us
          anytime to request data deletion or to understand how your data is being used.
        </p>

        <div className="mt-5">
          <Link to="/" className="btn btn-secondary">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
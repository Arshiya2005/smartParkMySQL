import React from "react";
import { Link } from "react-router-dom";
import NavbarLanding from "../components/NavbarLanding";

const ContactUs = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <NavbarLanding />

      <div className="container py-5">
        <h2 className="mb-4">Contact Us</h2>
        <p>If you have any questions, feedback, or need support, feel free to reach out to us.</p>

        <div className="mt-4">
          <h5>Email</h5>
          <p><a href="mailto:support@smartpark.in">support@smartpark.in</a></p>

          <h5>Phone</h5>
          <p>+91 98765 43210 (Mon–Fri, 9 AM – 6 PM)</p>

          <h5>Address</h5>
          <p>
            SmartPark Technologies Pvt. Ltd.<br />
            101, Tower B, TechHub Park,<br />
            Hinjewadi Phase II, Pune, Maharashtra – 411057
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="mt-5">
          <Link to="/" className="btn btn-secondary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
import React from "react";
import { Link } from "react-router-dom";
import NavbarLanding from "../components/NavbarLanding";

const Refund = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <NavbarLanding />

      <div className="container py-5">
        <h2 className="mb-4">Refund & Cancellation Policy</h2>
        <p>
          Cancellations are allowed up to the start time of your booking.
          There is no penalty for cancellations made before the booking starts.
        </p>
        <p>
          If you cancel your booking in time, your payment will be refunded
          to the original payment method within 5–7 business days.
        </p>
        <p>
          No refund will be issued if the booking time has already started.
        </p>

        <div className="mt-5">
          <Link to="/" className="btn btn-secondary">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Refund;
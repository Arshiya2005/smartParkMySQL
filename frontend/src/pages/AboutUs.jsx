import React from "react";
import NavBarCustomer from "../../components/NavBarCustomer";

const AboutUs = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <NavBarCustomer />
      <div className="container py-5">
        <h2 className="mb-4">About Us</h2>

        <p>
          SmartPark is a next-gen parking solution designed to help users find, book, and navigate to
          available parking spots with ease. We aim to reduce urban traffic congestion and save time through
          our intelligent, user-friendly platform.
        </p>

        <hr className="my-5" />

        <section>
          <h4>Privacy Policy</h4>
          <p>
            We value your privacy. Your personal data is stored securely and is never shared with third parties
            without your consent. We only collect data required to offer a smooth booking and payment experience.
          </p>
        </section>

        <section className="mt-4">
          <h4>Terms of Use</h4>
          <p>
            By using our platform, you agree to follow our guidelines for booking, payment, and cancellation.
            Any misuse, fraudulent booking, or violation of policies may result in account suspension.
          </p>
        </section>

        <section className="mt-4">
          <h4>Refund & Cancellation Policy</h4>
          <p>
            Cancellations made before the booking start time are eligible for a full refund. No refunds will be
            processed for cancellations made after the booking has started. Refunds, if applicable, will be credited
            to the original payment method within 5–7 business days.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
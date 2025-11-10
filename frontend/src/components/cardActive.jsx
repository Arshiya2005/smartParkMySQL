import React from "react";
import { Link } from "react-router-dom";
import useAuthCheck from "../hooks/useAuthCheck";
import active from "../assets/activeBooking.svg";

const CardActive = () => {
  const isAuthenticated = useAuthCheck("customer");
  if (!isAuthenticated) return null;

  return (
    <div className="card text-white bg-primary h-100">
      <div
        className="card-body d-flex flex-column justify-content-between"
        style={{ backgroundColor: "#2C786C" }}
      >
        <div className="d-flex flex-column align-items-center text-center">
          {/* SVG image */}
          <img
            src={active}
            alt="Active Bookings"
            style={{ maxHeight: "120px", width: "auto", marginBottom: "1rem" }}
            className="img-fluid"
          />

          <h5 className="card-title fs-4">Go to My Active Bookings</h5>
          <p className="card-text">
            View all your current parking slot reservations and manage them easily.
          </p>
        </div>

        {/* Button */}
        <div className="text-center mt-3">
          <Link to="/customer/activebookings" className="btn btn-light">
            View Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardActive;

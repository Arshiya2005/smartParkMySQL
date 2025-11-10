import React from "react";
import { Link } from "react-router-dom";
import useAuthCheck from "../hooks/useAuthCheck";
import newBooking from "../assets/bookNew.svg";

const CardBookNow = () => {
  const isAuthenticated = useAuthCheck("customer");
  if (!isAuthenticated) return null;

  return (
    <div className="card text-white bg-success h-100">
      <div
        className="card-body d-flex flex-column justify-content-between"
        style={{ backgroundColor: "#2C786C" }}
      >
        <div className="d-flex flex-column align-items-center text-center">
          {/* SVG image */}
          <img
            src={newBooking}
            alt="Book Parking"
            style={{ maxHeight: "120px", width: "auto", marginBottom: "1rem" }}
            className="img-fluid"
          />

          <h5 className="card-title fs-4">Book a New Parking Spot</h5>
          <p className="card-text">
            Find and reserve your next parking slot in just a few clicks.
          </p>
        </div>

        {/* Button */}
        <div className="text-center mt-3">
          <Link to="/customer/newbooking" className="btn btn-light">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardBookNow;

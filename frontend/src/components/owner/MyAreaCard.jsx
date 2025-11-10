import React from "react";
import { Link } from "react-router-dom";
import useAuthCheck from "../../hooks/useAuthCheck";
import myarea from "../../assets/myarea.svg"; // Replace with the actual image asset for 'My Area'

const MyAreaCard = () => {
  const isAuthenticated = useAuthCheck("owner");
  if (!isAuthenticated) return null;

  return (
    <div className="card text-white bg-primary h-100">
      <div
        className="card-body d-flex flex-column justify-content-between"
        style={{ backgroundColor: "#2D776C" }}
      >
        <div className="d-flex flex-column align-items-center text-center">
          {/* SVG image */}
          <img
            src={myarea}
            alt="My Area"
            style={{ maxHeight: "120px", width: "auto", marginBottom: "1rem" }}
            className="img-fluid"
          />

          <h5 className="card-title fs-4">Go to My Area</h5>
          <p className="card-text">
            View and manage your listed parking spots, availability, and pricing.
          </p>
        </div>

        {/* Button */}
        <div className="text-center mt-3">
          <Link to="/owner/myarea" className="btn btn-light">
            Manage Area
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyAreaCard;
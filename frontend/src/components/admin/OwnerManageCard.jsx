import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const OwnerManageCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/admin/owners");
  };

  return (
    <div
      className="card shadow-sm border-0 mb-4"
      style={{
        backgroundColor: "#F7FFF7", // soft white from your palette
        border: "1px solid #2C786C", // pine green border
        borderRadius: "16px",
      }}
    >
      <div className="card-body d-flex flex-column align-items-center text-center">
        <h4 className="card-title mb-3" style={{ color: "#1B1B1E" }}>
          Manage Owners
        </h4>
        <p className="card-text mb-4 text-muted">
          View owner profiles, their registered areas, and activity details.
        </p>
        <button
          onClick={handleClick}
          className="btn"
          style={{
            backgroundColor: "#2C786C",
            color: "#fff",
            border: "none",
            fontWeight: "500",
            padding: "0.5rem 1.2rem",
            borderRadius: "8px",
          }}
        >
          Go to Owner Manager
        </button>
      </div>
    </div>
  );
};

export default OwnerManageCard;
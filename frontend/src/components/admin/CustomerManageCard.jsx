import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const CustomerManageCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/admin/customers");
  };

  return (
    <div
      className="card shadow-sm border-0 mb-4"
      style={{
        backgroundColor: "#F7FFF7",
        border: "1px solid #DA7422", // orange border
        borderRadius: "16px",
      }}
    >
      <div className="card-body d-flex flex-column align-items-center text-center">
        <h4 className="card-title mb-3" style={{ color: "#1B1B1E" }}>
          Manage Customers
        </h4>
        <p className="card-text mb-4 text-muted">
          View customer details, vehicles, and their booking history.
        </p>
        <button
          onClick={handleClick}
          className="btn"
          style={{
            backgroundColor: "#DA7422",
            color: "#fff",
            border: "none",
            fontWeight: "500",
            padding: "0.5rem 1.2rem",
            borderRadius: "8px",
          }}
        >
          Go to Customer Manager
        </button>
      </div>
    </div>
  );
};

export default CustomerManageCard;
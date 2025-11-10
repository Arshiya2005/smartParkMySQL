// AreaCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AreaCard = ({ area }) => {
  const navigate = useNavigate();

  return (
    <div className="card shadow-sm p-3 d-flex flex-column gap-2">
      <h5 className="mb-1">{area.name}</h5>
      <p className="mb-1 text-muted">{area.location || "Location not available"}</p>
      <p className="mb-1">Bike Slots: {area.bike} | Car Slots: {area.car}</p>
      <button
        className="btn btn-outline-primary align-self-start"
        onClick={() => navigate("/owner/specificArea", { state: { area } })}
      >
        View Area Details
      </button>
    </div>
  );
};

export default AreaCard;
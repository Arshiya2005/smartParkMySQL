// src/components/SlotCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const SlotCard = ({ spot }) => {
  const navigate = useNavigate();

  const handleChoose = () => {
    // You may pass spot to next page or call backend from here
    navigate("/customer/chooseslot", { state: { spot } });
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{spot.name}</h5>
        <p className="card-text">
          Distance: {(spot.distance / 1000).toFixed(2)} km <br />
          {/* Duration: {(spot.duration / 60).toFixed(1)} minutes */}
        </p>
        <button className="btn btn-success" onClick={handleChoose}>
          Select this Spot
        </button>
      </div>
    </div>
  );
};

export default SlotCard;
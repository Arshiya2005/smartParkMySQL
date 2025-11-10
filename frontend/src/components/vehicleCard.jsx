// src/components/VehicleCard.jsx
import React from "react";
import { FaTrash } from "react-icons/fa";

const VehicleCard = ({ vehicle, onDelete }) => {
  const { id, model, number, type } = vehicle;

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title mb-1">{model}</h5>
          <p className="mb-0 text-muted">{number}</p>
          <p className="mb-0 text-muted text-capitalize">{type}</p>
        </div>
        <button className="btn btn-outline-danger" onClick={() => onDelete(id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
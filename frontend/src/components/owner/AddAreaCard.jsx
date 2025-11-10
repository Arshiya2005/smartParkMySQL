import React from "react";
import { Link } from "react-router-dom";
import addarea from "../../assets/addarea.svg"; // Make sure to add this asset

const AddAreaCard = () => {
  return (
    <div className="card text-white bg-success h-100">
      <div
        className="card-body d-flex flex-column justify-content-between"
        style={{ backgroundColor: "#2D776C" }} // Air Force Blue from your palette
      >
        <div className="d-flex flex-column align-items-center text-center">
          <img
            src={addarea}
            alt="Add New Area"
            style={{ maxHeight: "120px", width: "auto", marginBottom: "1rem" }}
            className="img-fluid"
          />
          <h5 className="card-title fs-4">Add New Parking Area</h5>
          <p className="card-text">
            Start listing a new parking space by providing area and slot details.
          </p>
        </div>

        <div className="text-center mt-3">
          <Link to="/owner/addarea" className="btn btn-light">
            Add Area
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddAreaCard;

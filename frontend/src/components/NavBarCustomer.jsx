import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import useAuthCheck from "../hooks/useAuthCheck";
import useAuthRedirect from "../hooks/useAuthRedirect";

const NavBarCustomer = () => {
    useAuthRedirect("customer");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/customer">
        ParkSmart
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#customerNavbar"
        aria-controls="customerNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="customerNavbar">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/customer/profile">
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBarCustomer;

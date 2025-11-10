import React from "react";
import { Link } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";

const AdminNavBar = () => {
  useAuthRedirect("admin");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/admin">
        ParkSmart Admin
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#adminNavbar"
        aria-controls="adminNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="adminNavbar">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/admin/profile">
              Profile
            </Link>
          </li>
          
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavBar;
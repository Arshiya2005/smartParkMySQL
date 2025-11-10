import React from "react";
import { Link } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";

const NavBarOwner = () => {
  useAuthRedirect("owner");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/owner">
        ParkSmart
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#ownerNavbar" // ✅ Corrected to match below
        aria-controls="ownerNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="ownerNavbar"> {/* ✅ ID matches data-bs-target */}
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/owner/profile">
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBarOwner;
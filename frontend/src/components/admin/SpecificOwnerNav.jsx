import React from "react";
import { NavLink } from "react-router-dom";

const SpecificOwnerNav = () => {
  return (
    <nav className="nav nav-tabs mb-3">
      <NavLink end to="areas" className="nav-link">
        🏘️ Areas Owned
      </NavLink>
      <NavLink to="active" className="nav-link">
        📆 Active Bookings
      </NavLink>
      <NavLink to="history" className="nav-link">
        📜 Booking History
      </NavLink>
    </nav>
  );
};

export default SpecificOwnerNav;
import React from "react";
import { NavLink, Link } from "react-router-dom";

const CustProfileNav = () => {
  const linkStyle = {
    fontSize: "1.6rem",
    margin: "0 1rem",
    color: "white",
  };

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4 py-2 bg-black shadow-sm"
      style={{ position: "sticky", top: 0, zIndex: 10 }}
    >
      {/* 🔙 Back to Dashboard */}
      <Link to="/customer" style={{ color: "white", fontSize: "1.6rem" }} title="Back to Dashboard">
        <i className="bi bi-arrow-left-circle" />
      </Link>

      {/* 🔗 Profile Navigation Links */}
      <div className="d-flex justify-content-center align-items-center">
        <NavLink
          to="info"
          className="nav-link"
          style={({ isActive }) => ({
            ...linkStyle,
            borderBottom: isActive ? "2px solid #af9164" : "none",
          })}
        >
          <i className="bi bi-person-circle" title="Info" />
        </NavLink>

        <NavLink
          to="history"
          className="nav-link"
          style={({ isActive }) => ({
            ...linkStyle,
            borderBottom: isActive ? "2px solid #af9164" : "none",
          })}
        >
          <i className="bi bi-clock-history" title="Booking History" />
        </NavLink>

        <NavLink
          to="notifications"
          className="nav-link"
          style={({ isActive }) => ({
            ...linkStyle,
            borderBottom: isActive ? "2px solid #af9164" : "none",
          })}
        >
          <i className="bi bi-bell" title="Notifications" />
        </NavLink>

        <NavLink
          to="vehicles"
          className="nav-link"
          style={({ isActive }) => ({
            ...linkStyle,
            borderBottom: isActive ? "2px solid #af9164" : "none",
          })}
        >
          <i className="bi bi-car-front" title="Vehicles" />
        </NavLink>
      </div>
    </nav>
  );
};

export default CustProfileNav;

import React from "react";
import { NavLink, Link } from "react-router-dom";

const OwnerProfileNav = () => {
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
      <Link
        to="/owner"
        style={{ color: "white", fontSize: "1.6rem" }}
        title="Back to Owner Dashboard"
        aria-label="Back to Owner Dashboard"
      >
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
          title="Owner Info"
        >
          <i className="bi bi-person-circle" />
        </NavLink>

        {/* <NavLink
          to="history"
          className="nav-link"
          style={({ isActive }) => ({
            ...linkStyle,
            borderBottom: isActive ? "2px solid #af9164" : "none",
          })}
          title="Booking History"
        >
          <i className="bi bi-clock-history" />
        </NavLink> */}

        <NavLink
          to="notifications"
          className="nav-link"
          style={({ isActive }) => ({
            ...linkStyle,
            borderBottom: isActive ? "2px solid #af9164" : "none",
          })}
          title="Notifications"
        >
          <i className="bi bi-bell" />
        </NavLink>
      </div>
    </nav>
  );
};

export default OwnerProfileNav;
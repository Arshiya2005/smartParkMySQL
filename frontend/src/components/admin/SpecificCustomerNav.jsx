import React from "react";
import { NavLink } from "react-router-dom";

const SpecificCustomerNav = () => {
  const navItems = [
    { label: "Active Bookings", path: "active" },
    { label: "Vehicles", path: "vehicles" },
    { label: "Booking History", path: "history" },
  ];

  return (
    <div className="bg-light border-bottom py-2 mb-4">
      <div className="container d-flex gap-3">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `nav-link px-3 py-2 rounded ${
                isActive ? "bg-primary text-white" : "text-dark"
              }`
            }
            style={{ textDecoration: "none", fontWeight: "500" }}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SpecificCustomerNav;
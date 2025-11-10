import React from "react";

const NavbarLanding = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top"
      style={{ backgroundColor: '#2c786c' }} // Full navbar now turquoise
    >
      <div className="container">
        {/* Removed SmartPark brand name */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav w-100 d-flex justify-content-around">
            <li className="nav-item">
              <a className="nav-link" href="#home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#join">Join Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About Us</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLanding;

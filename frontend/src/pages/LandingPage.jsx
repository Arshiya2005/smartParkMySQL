import React from 'react';
import { Link } from 'react-router-dom';
import NavbarLanding from '../components/NavbarLanding';
import TripIllustration from '../assets/car.svg';
import LocationSearchIcon from '../assets/locationSearch.svg';
import ClockIcon from '../assets/clock.svg';
import AddParkingIcon from '../assets/addParking.svg';

const LandingPage = () => {
  return (
    <>
      <NavbarLanding />

      {/* Home Section */}
      <section
        id="home"
        className="py-5 text-center"
        style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to SmartPark!</h1>
          <div className="d-flex justify-content-center">
            <img
              src={TripIllustration}
              alt="Smart Parking Illustration"
              className="img-fluid my-4"
              style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px' }}
            />
          </div>
          <p className="lead mt-3">
            Finding parking shouldn't be stressful. Whether you're looking for a spot near your
            office or want to list your unused space — SmartPark makes it easy.
          </p>
          <p className="mt-3">
            Discover real-time parking availability, reserve your slot in seconds, and start earning
            with your idle space.
          </p>
          <a href="#join" className="btn btn-lg mt-4" style={{ backgroundColor: '#ff6262', color: '#fff', border: 'none' }}>
            Get Started
          </a>

          {/* Feature Cards */}
          <div className="row mt-5 g-4">
            {[{
              icon: LocationSearchIcon,
              title: 'Real-Time Location Search',
              desc: 'Quickly find available parking spots near your destination using smart filters.',
            }, {
              icon: ClockIcon,
              title: 'Book Time Slots',
              desc: 'Reserve only for the hours you need — skip the full-day charges.',
            }, {
              icon: AddParkingIcon,
              title: 'List & Earn',
              desc: "Got space? List it. Let it earn for you while you're away.",
            }].map((card, idx) => (
              <div key={idx} className="col-md-4">
                <div
                  className="card h-100 shadow"
                  style={{
                    backgroundColor: 'rgba(44, 120, 108, 0.55)',
                    color: '#fff',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '950px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div className="card-body">
                    <img src={card.icon} alt={card.title} style={{ height: '148px', marginBottom: '1rem' }} />
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section
        id="join"
        className="py-5 text-center"
        style={{ backgroundColor: '#537d8d', color: 'var(--text-color)' }}
      >
        <div className="container">
          <h2 className="mb-4">Join SmartPark</h2>
          <div className="row justify-content-center g-4">

            {/* User Card */}
            <div className="col-md-4">
              <div className="card card-custom shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">I'm a User</h5>
                  <p className="card-text">Search, book, and manage your parking with ease.</p>
                  <Link
                    to="/login?type=customer"
                    className="btn"
                    style={{
                      backgroundColor: '#ff6262',
                      color: '#fff',
                      padding: '0.6rem 1.2rem',
                      border: 'none',
                      borderRadius: '0.25rem',
                      fontWeight: '500',
                    }}
                  >
                    Join as Customer
                  </Link>
                </div>
              </div>
            </div>

            {/* Owner Card */}
            <div className="col-md-4">
              <div className="card card-custom shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">I'm a Parking Slot Owner</h5>
                  <p className="card-text">
                    List your space, set prices, and start earning today.
                  </p>
                  <Link
                    to="/login?type=owner"
                    className="btn"
                    style={{
                      backgroundColor: '#ff6162',
                      color: '#fff',
                      padding: '0.6rem 1.2rem',
                      border: 'none',
                      borderRadius: '0.25rem',
                      fontWeight: '500',
                    }}
                  >
                    Join as Owner
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Us + Policies + Contact Section */}
      <section
        id="about"
        className="py-5"
        style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
      >
        <div className="container text-center">
          <h2 className="mb-4">About SmartPark</h2>
          {[
            "SmartPark is more than just a parking solution — it's a movement toward smarter, cleaner, and more efficient urban mobility.",
            "Born from a desire to simplify city life, our platform empowers users to find parking effortlessly and unlock income from their idle spaces.",
            "Whether you're heading to work, shopping downtown, or planning an event, SmartPark helps you park with confidence and ease.",
            "We believe in sustainability, smart infrastructure, and community-driven technology. Each listed spot contributes to less traffic congestion, fewer emissions, and a better city experience.",
            "Our mission is simple: turn everyday hassles into seamless experiences through intuitive design and intelligent systems.",
            "Built by a team of students passionate about tech and urban impact, SmartPark blends innovation with practicality for real-world results.",
          ].map((text, index) => (
            <p key={index}>{text}</p>
          ))}

          {/* Policy Links */}
          <div className="row mt-5 justify-content-center">
            {[
              { label: "Privacy Policy", route: "/privacy" },
              { label: "Terms of Use", route: "/terms" },
              { label: "Refund & Cancellation Policy", route: "/refund" },
            ].map((item, idx) => (
              <div className="col-md-3 mb-3" key={idx}>
                <Link to={item.route} className="btn btn-outline-primary w-100">
                  {item.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Contact Us CTA */}
          <div className="mt-4">
            <h5>Have Questions?</h5>
            <p>We're always here to help!</p>
            <Link to="/contact" className="btn btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
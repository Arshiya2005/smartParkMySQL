// src/pages/customer/NearbySpots.jsx
import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";
import NearbyMap from "../../components/NearbyMap";
import SlotCard from "../../components/SlotCard";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useBookingReminders from "../../hooks/useBookingReminders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const NearbySpots = () => {
  useAuthRedirect("customer");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/customer/welcome`, {
          credentials: "include",
        });
        const result = await res.json();
        const user = result?.data;

        if (res.ok && user?.type === "customer") {
          const id = user.id || user._id;
          setUserId(id);
        }
      } catch (err) {
        console.error("❌ Error fetching user in MakeNewBooking:", err);
      }
    };

    fetchUser();
  }, []);

  useBookingReminders(userId); // ✅ Listen to reminders here
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  if (!data) {
    return (
      <div>
        <NavBarCustomer />
        <div className="container mt-4">
          <h4>Error</h4>
          <p>Oops! Something went wrong. Error Code: 204</p>
          <button className="btn btn-primary" onClick={() => navigate("/customer/newbooking")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const userLoc = data.userloc;
  const slots = data.data;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <NavBarCustomer />

      <div className="container mt-4">
        <h3>Nearby Parking Spots</h3>

        {/* Map */}
        <div className="my-4">
          <NearbyMap userLocation={userLoc} spots={slots} />
        </div>

        {/* Slots List */}
        <div className="row">
          {slots.length > 0 ? (
            slots.map((spot) => (
              <div className="col-md-6 col-lg-4 mb-4" key={spot.id}>
                <SlotCard spot={spot} />
              </div>
            ))
          ) : (
            <p className="text-muted">No parking spots found nearby.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbySpots;
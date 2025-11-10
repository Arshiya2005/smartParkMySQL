import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useBookingReminders from "../../hooks/useBookingReminders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const BookingDetails = () => {
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
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state?.data;

  if (!data) {
    return (
      <div>
        <NavBarCustomer />
        <div className="container py-4">
          <p className="text-danger">No booking details found.</p>
        </div>
      </div>
    );
  }

  const { book, spot, vehicle, owner } = data;

  const dateOnly = book.date.split("T")[0]; // Extract YYYY-MM-DD
  const startDateTime = new Date(`${dateOnly}T${book.sTime}`);
  const endDateTime = new Date(`${dateOnly}T${book.eTime}`);
  const handleCancel = () => {
    try {
      const now = new Date();
  
      const dateOnly = new Date(book.date).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // yyyy-mm-dd
      const startDateTime = new Date(`${dateOnly}T${book.sTime}`);
  
      if (now < startDateTime) {
        navigate("/customer/cancelbooking", { state: { bookingId: book.id } });
      } else {
        alert("You can't cancel now. Booking has already started or ended.");
      }
    } catch (err) {
      console.error("⚠️ Error during cancellation logic:", err);
      alert("Something went wrong while checking cancellation eligibility.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />
      <div className="container py-4">
        <h2 className="mb-4">Booking Details</h2>

        <div className="card shadow p-4" style={{ borderRadius: "12px" }}>
          <h5>Booking Info</h5>
          <p><strong>Type:</strong> {book.type}</p>
          <p><strong>Start Time:</strong> {book.sTime}</p>
          <p><strong>End Time:</strong> {book.eTime}</p>
          <p><strong>Date:</strong> {new Date(book.date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</p>

          <h5 className="mt-4">Parking Spot Info</h5>
          <p><strong>Name:</strong> {spot.name}</p>

          <h5 className="mt-4">Vehicle Info</h5>
          <p><strong>Model:</strong> {vehicle.model}</p>
          <p><strong>Type:</strong> {vehicle.type}</p>

          <h5 className="mt-4">Owner Info</h5>
          <p><strong>Name:</strong> {owner.fname} {owner.lname}</p>
          <p><strong>Username:</strong> {owner.username}</p>

          <div className="mt-4 d-flex gap-3">
            <button className="btn btn-danger" onClick={handleCancel}>
              Cancel Booking
            </button>
            <a
              className="btn btn-primary"
              href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lon}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Navigate to Spot
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
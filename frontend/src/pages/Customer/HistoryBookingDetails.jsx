import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useBookingReminders from "../../hooks/useBookingReminders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const HistoryBookingDetails = () => {
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
  const booking = state?.booking;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecificBooking = async () => {
      try {
        const query = new URLSearchParams({
          book: encodeURIComponent(JSON.stringify(booking)),
        }).toString();

        const res = await fetch(`${BASE_URL}/customer/Specificbooking?${query}`, {
          method: "GET",
          credentials: "include",
        });

        const result = await res.json();
        console.log("📦 History booking details received:", result);

        if (res.ok) {
          setData(result);
        } else {
          setError(result?.error || "Something went wrong");
        }
      } catch (err) {
        console.error("❌ Error fetching specific booking:", err);
        setError("Failed to fetch booking details.");
      }
    };

    if (booking) fetchSpecificBooking();
    else setError("No booking data provided.");
  }, [booking]);

  if (error) {
    return (
      <div>
        
        <div className="container py-4">
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <NavBarCustomer />
        <div className="container py-4">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  const { book, spot, vehicle, owner } = data;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
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
          <p className="mb-1">
  <strong>Status:</strong>{" "}
  <span
    className={`badge px-2 py-1 rounded-pill ${
      book.status === "confirmed"
        ? "bg-success"
        : book.status === "cancelled"
        ? "bg-danger"
        : book.status === "completed"
        ? "bg-primary"
        : "bg-secondary"
    }`}
    style={{ textTransform: "capitalize", fontSize: "0.9rem" }}
  >
    {book.status}
  </span>
</p>
        </div>
      </div>
    </div>
  );
};

export default HistoryBookingDetails;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const BookingDetailsO = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  const booking = state?.booking;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!booking) {
        setError("No booking data found.");
        return;
      }

      try {
        const res = await fetch(
          `${BASE_URL}/owner/Specificbooking?book=${encodeURIComponent(
            JSON.stringify(booking)
          )}`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch details");

        console.log("📦 Booking Details Response:", data);
        setDetails(data);
      } catch (err) {
        console.error("❌ BookingDetails fetch error:", err);
        setError("Something went wrong.");
      }
    };

    fetchDetails();
  }, [booking]);

  if (error)
    return <div className="container py-5 text-danger text-center">{error}</div>;
  if (!details)
    return <div className="container py-5 text-center">Loading details...</div>;

  const { book, vehicle, owner, spot } = details;

  const formatTime = (time) => (time ? time.slice(0, 5) : "--:--");
  const formatDate = (d) => new Date(d).toLocaleDateString();

  return (
    <div className="container py-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="mb-4 text-center">Booking Details</h2>

      <ul className="list-group shadow">
        <li className="list-group-item">
          <strong>Booking ID:</strong> {book.id}
        </li>
        <li className="list-group-item">
          <strong>Date:</strong> {formatDate(book.date)}
        </li>
        <li className="list-group-item">
          <strong>Start Time:</strong> {formatTime(book.sTime)}
        </li>
        <li className="list-group-item">
          <strong>End Time:</strong> {formatTime(book.eTime)}
        </li>
        <li className="list-group-item">
          <strong>Status:</strong>{" "}
          <span
            className={`badge ${
              book.status === "active"
                ? "bg-success"
                : book.status === "inactive"
                ? "bg-secondary"
                : "bg-danger"
            }`}
          >
            {book.status}
          </span>
        </li>
        <li className="list-group-item">
        <p><strong>Amount Paid:</strong> {book.amount !== null ? `₹${book.amount}` : "—"}</p>
        </li>
        <li className="list-group-item">
          <strong>Slot No:</strong> {book.slot_no}
        </li>

        <li className="list-group-item">
          <strong>Vehicle:</strong>{" "}
          {vehicle?.brand} ({vehicle?.type}) – {vehicle?.vehicle_no}
        </li>

        <li className="list-group-item">
          <strong>Parking Spot:</strong>{" "}
          {spot?.name} in {spot?.area}, {spot?.city}
        </li>

        <li className="list-group-item">
          <strong>Owner:</strong>{" "}
          {owner?.fname} {owner?.lname} ({owner?.username})
        </li>
      </ul>
    </div>
  );
};

export default BookingDetailsO;
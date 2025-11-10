import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import NavBarCustomer from "../../components/NavBarCustomer";
import useBookingReminders from "../../hooks/useBookingReminders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const MyActiveBookings = () => {
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
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]); // now stores all bookings
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBooking = async () => {
      try {
        const res = await fetch(`${BASE_URL}/customer/activeBooking`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
  
        console.log("🔵 Received from /activeBooking:", data); // ✅ log here
  
        if (res.ok && data.data && data.data.length > 0) {
          setBookings(data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching active booking:", err);
        setLoading(false);
      }
    };
    fetchActiveBooking();
  }, []);

  const fetchBookingDetails = async (book) => {
    try {
      const query = new URLSearchParams({
        book: encodeURIComponent(JSON.stringify(book)) // serialize full object
      }).toString();
  
      const res = await fetch(
        `${BASE_URL}/customer/Specificbooking?${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
  
      const data = await res.json();
  
      if (res.ok) {
        navigate("/customer/bookingdetails", { state: { data } });
      } else {
        console.error("Specific booking error:", data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error in fetchBookingDetails:", err);
    }
  };

  const getBookingStatus = (booking) => {
    const now = new Date();
    const s = new Date(`1970-01-01T${booking.sTime}`);
    const n = new Date(`1970-01-01T${now.toTimeString().split(" ")[0]}`);
    return n < s ? "Upcoming" : "Ongoing";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />
      <div className="container py-4">
        <h2 className="mb-4">My Active Bookings</h2>

        {loading ? (
          <p>Loading your active bookings...</p>
        ) : bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <div
            key={index}
            className="card shadow p-3 d-flex justify-content-between align-items-center flex-row mb-3"
            style={{ borderRadius: "12px", cursor: "pointer" }}
            onClick={() => fetchBookingDetails(booking)}
          >
            <div>
              <p className="mb-1"><strong>Slot No:</strong> {booking.slot_no}</p>
              <p className="mb-1"><strong>Vehicle Type:</strong> {booking.type}</p>
              <p className="mb-1"><strong>Start Time:</strong> {booking.sTime}</p>
              <p className="mb-1"><strong>End Time:</strong> {booking.eTime}</p>
              <p className="mb-1">
  <strong>Status:</strong>{" "}
  <span
    className={`badge px-2 py-1 rounded-pill ${
      booking.status === "confirmed"
        ? "bg-success"
        : booking.status === "cancelled"
        ? "bg-danger"
        : booking.status === "completed"
        ? "bg-primary"
        : "bg-secondary"
    }`}
    style={{ textTransform: "capitalize", fontSize: "0.9rem" }}
  >
    {booking.status}
  </span>
</p>
            </div>
            <button className="btn btn-outline-primary">&gt;</button>
          </div>
          ))
        ) : (
          <p className="text-muted">You currently have no active bookings.</p>
        )}
      </div>
    </div>
  );
};

export default MyActiveBookings;
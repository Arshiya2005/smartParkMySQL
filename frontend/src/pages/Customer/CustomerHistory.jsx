import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from 'react-icons/fa';
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useBookingReminders from "../../hooks/useBookingReminders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const CustomerHistory = () => {
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
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔁 useEffect triggered - fetching booking history");

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/customer/Bookinghistory`, {
          withCredentials: true,
        });

        console.log("✅ Booking history fetched:", res.data);

        const bookingsArray = Array.isArray(res.data.data) ? res.data.data : [];
        setHistory(bookingsArray);
      } catch (err) {
        console.error("❌ Error fetching booking history:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="p-4">Loading booking history...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Booking History</h2>
      {history.length === 0 ? (
        <p>No bookings in history.</p>
      ) : (
        history.map((booking, index) => (
          <div key={index} className="card shadow p-3 mb-3 position-relative">
            <p><strong>Booking ID:</strong> {booking.id}</p>
            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString("en-IN")}</p>
            <p><strong>Start Time:</strong> {booking.sTime}</p>
            <p><strong>End Time:</strong> {booking.eTime}</p>
            <p className="mb-1"><strong>Status:</strong> <span className="badge bg-info">{booking.status}</span></p>

            <button
              className="btn btn-light btn-sm position-absolute"
              style={{ top: "10px", right: "10px" }}
              onClick={() => navigate("/customer/profile/historydetails", { state: { booking } })}
            >
              <FaChevronRight />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerHistory;
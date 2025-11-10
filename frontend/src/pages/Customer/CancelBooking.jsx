import React from 'react';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBarCustomer from "../../components/NavBarCustomer";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useBookingReminders from "../../hooks/useBookingReminders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const CancelBooking = () => {
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
  const bookingId = location.state?.bookingId;

  useEffect(() => {
    const cancelBooking = async () => {
      if (!bookingId) {
        toast.error("Booking ID not found.");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/customer/cancelBooking?id=${bookingId}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (res.ok) {
          toast.success(data.message || "Booking cancelled!");
          setTimeout(() => {
            navigate("/customer/activebookings");
          }, 2000);
        } else {
          toast.error(data.error || "Cancellation failed.");
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("An unexpected error occurred.");
      }
    };

    cancelBooking();
  }, [bookingId, navigate]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />
      <div className="container py-5">
        <h3>Processing cancellation...</h3>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CancelBooking;
import { useEffect } from "react";
import { toast } from "react-toastify";
import socket from "../socket";
import { useNavigate, useLocation } from "react-router-dom";

const useBookingReminders = (userId) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userId) return;

    // 👂 Handlers
    const handleBookingReminder = (data) => {
      toast.info(data?.message || "🚗 Your parking is starting soon!");
    };

    const handleEndReminder = (data) => {
      toast.warn(data?.message || "⏱️ Your parking ends in 15 minutes!");
    };

    const handleBookingEnded = (data) => {
      toast.error(data?.message || "❌ Your parking time has ended.");
    };

    const handleTimeout = (data) => {
      if (location.pathname === "/paynow") {
        toast.error(data?.message || "❌ Booking failed due to timeout.");
        navigate("/customer");
      } else {
        console.log("Timeout event received, but not on /paynow");
      }
    };

    // ✅ Register event listeners
    socket.off("booking-reminder").on("booking-reminder", handleBookingReminder);
    socket.off("booking-end-reminder").on("booking-end-reminder", handleEndReminder);
    socket.off("booking-ended").on("booking-ended", handleBookingEnded);
    socket.off("timeout").on("timeout", handleTimeout);

    // 🧹 Cleanup
    return () => {
      socket.off("booking-reminder", handleBookingReminder);
      socket.off("booking-end-reminder", handleEndReminder);
      socket.off("booking-ended", handleBookingEnded);
      socket.off("timeout", handleTimeout);
    };
  }, [userId, location.pathname, navigate]);
};

export default useBookingReminders;
// src/BookingReminderListener.jsx
import { useEffect } from "react";
import socket from "../socket";
import { toast } from "react-toastify";

const BookingReminderListener = ({ userId }) => {
  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit("register", userId);

    socket.on("booking-reminder", ({ message }) => {
      toast.info(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return null;
};

export default BookingReminderListener;
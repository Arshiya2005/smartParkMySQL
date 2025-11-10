import React, { useEffect, useState } from 'react';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import NavBarCustomer from '../../components/NavBarCustomer';
import BookingForm from './BookingForm';
import useBookingReminders from '../../hooks/useBookingReminders';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const MakeNewBooking = () => {
  useAuthRedirect("customer");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/customer/welcome"`, {
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBarCustomer />
      <div className="container py-4">
        <h2 className="mb-4">Make a New Booking</h2>
        <BookingForm />
      </div>
    </div>
  );
};

export default MakeNewBooking;
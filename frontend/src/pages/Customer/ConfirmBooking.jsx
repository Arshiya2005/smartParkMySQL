// src/pages/customer/ConfirmBooking.jsx

import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarCustomer from "../../components/NavBarCustomer";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useBookingReminders from "../../hooks/useBookingReminders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const ConfirmBooking = () => {
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

  const booking = state?.booking;
  const sTime = state?.sTime;
  const eTime = state?.eTime;
  const price = state?.price;

  if (!booking || !sTime || !eTime || !price) {
    return (
      <div>
        <NavBarCustomer />
        <div className="container mt-5">
          <h4 className="text-danger">Invalid access. Booking details missing.</h4>
          <button className="btn btn-secondary mt-3" onClick={() => navigate("/customer")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { slot, vehicle, chosenSlotNo, ownerdata } = booking;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <NavBarCustomer />
      <div className="container py-5">
        <h2 className="mb-4">Confirm Your Booking</h2>

        <div className="card shadow p-4" style={{ borderRadius: "12px" }}>
          <h5 className="mb-3">Booking Summary</h5>

          <p><strong>Parking Spot:</strong> {slot[0].name}</p>
          <p><strong>Slot Number:</strong> {chosenSlotNo}</p>
          <p><strong>Start Time:</strong> {sTime}</p>
          <p><strong>End Time:</strong> {eTime}</p>

          <hr />

          <p><strong>Vehicle:</strong> {vehicle[0].model} ({vehicle[0].number})</p>
          <p><strong>Owner:</strong> {ownerdata.fname} {ownerdata.lname}</p>
          <p><strong>Owner Email:</strong> {ownerdata.username}</p>

          <hr />

          <p className="fs-5"><strong>Total Price:</strong> ₹{price}</p>

          <div className="d-flex gap-3 mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              ← Back to Slot Selection
            </button>
            <button
  className="btn btn-success"
  onClick={() => {
    console.log("Proceed to Pay clicked!");
    console.log("Slot:", slot?.[0]);
    console.log("Vehicle:", vehicle?.[0]);
    console.log("Owner:", ownerdata);
    console.log("Slot No:", chosenSlotNo);
    console.log("Start Time:", sTime);
    console.log("End Time:", eTime);
    console.log("Price:", price);

    navigate("/customer/pay", {
      state: {
        data: {
          slot: slot[0],
          vehicle: vehicle[0],
          owner: ownerdata,
          chosenSlotNo,
          sTime,
          eTime,
          price,
        },
      },
    });
  }}
>
  Proceed to Pay
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
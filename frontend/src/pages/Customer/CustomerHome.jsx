import React, { useEffect, useState } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import NavBarCustomer from "../../components/NavBarCustomer";
import WlcCardCustomer from "../../components/WlcCardCustomer";
import CardActive from "../../components/cardActive";
import CardBookNow from "../../components/cardBookNow";
import peaach from "../../assets/green_back.jpg";
import socket from "../../socket";
import { toast } from "react-toastify";
import useBookingReminders from "../../hooks/useBookingReminders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const CustomerHome = () => {
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
  
          if (!socket.connected) {
            socket.connect(); // ✅ Actually connect now
            console.log("🔌 Socket connected from CustomerHome");
          }
  
          socket.emit("register-user", id);
          console.log("📌 Re-emitted register-user:", id);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user in CustomerHome:", err);
      }
    };
  
    fetchUser();
  }, []);
    
      // Don't disconnect here anymore
      // socket.disconnect(); ❌ remove this
   

  useBookingReminders(userId);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${peaach})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBarCustomer />
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <WlcCardCustomer />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <CardActive />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <CardBookNow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
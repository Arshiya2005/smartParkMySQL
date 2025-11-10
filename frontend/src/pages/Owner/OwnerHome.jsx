import React, { useEffect, useState } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import NavBarOwner from "../../components/owner/NavBarOwner";
import WlcOwner from "../../components/owner/WlcOwner.jsx";
import MyAreaCard from "../../components/owner/MyAreaCard.jsx";
import AddAreaCard from "../../components/owner/AddAreaCard.jsx";
import ownerBg from "../../assets/green_back.jpg";
import socket from "../../socket"; // 👈 default import like customer
import { toast } from "react-toastify";
import useOwnerNotifications from "../../hooks/useOwnerNotifications";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const OwnerHome = () => {
  useAuthRedirect("owner");
  const [ownerId, setOwnerId] = useState(null);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`${BASE_URL}/owner/welcome`, {
          credentials: "include",
        });
        const result = await res.json();
        const owner = result?.data;

        if (res.ok && owner?.type === "owner") {
          const id = owner.id || owner._id;
          setUserId(id);

          if (!socket.connected) {
            socket.connect();
            console.log("🔌 Socket connected from OwnerHome");
          }

          socket.emit("register-user", id);
          console.log("📌 Re-emitted register-user:", id);
        }
      } catch (err) {
        console.error("❌ Failed to fetch owner in OwnerHome:", err);
      }
    };

    fetchOwner();
  }, []);

  useOwnerNotifications(userId);
  useEffect(() => {
    if (!userId) return;

    const handlePayment = (data) => {
      console.log("💰 Parking Payment Notification:", data.message);
      toast.success(data.message, { position: "top-right" });
    };

    socket.on("parking-payment", handlePayment);

    return () => {
      socket.off("parking-payment", handlePayment);
    };
  }, [userId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${ownerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBarOwner />
      <div className="container py-4">
        {/* Welcome Card */}
        <div className="row mb-4">
          <div className="col-12">
            <WlcOwner />
          </div>
        </div>

        {/* Cards */}
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <MyAreaCard />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <AddAreaCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;
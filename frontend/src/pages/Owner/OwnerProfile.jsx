import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import OwnerProfileNav from "../../components/owner/OwnerProfileNav";
import useOwnerNotifications from "../../hooks/useOwnerNotifications";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const OwnerProfile = () => {
  useAuthRedirect("owner");
  const [ownerId, setOwnerId] = useState(null);
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
          setOwnerId(id);
          console.log("🧑‍💼 Owner ID fetched:", id);
        } else {
          console.error("⚠️ Failed to verify owner");
        }
      } catch (err) {
        console.error("❌ Error fetching owner in OwnerDashboard:", err);
      }
    };

    fetchOwner();
  }, []);

  // ✅ Listen for parking-payment events via socket
  useOwnerNotifications(ownerId);
  return (
    <div>
      <OwnerProfileNav/>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default OwnerProfile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useOwnerNotifications from "../../hooks/useOwnerNotifications";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const OwnerNotifications = () => {
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/notifications`, {
        withCredentials: true,
      });
      console.log(res.data);
      // ✅ Only set if the response is structured properly
      if (
        res.data &&
        typeof res.data === "object" &&
        Array.isArray(res.data.notifications)
      ) {
        setNotifications(res.data.notifications);
      } else {
        console.warn("Unexpected response format:", res.data);
        setNotifications([]); // prevent crash
      }
    } catch (err) {
      console.error("Failed to fetch owner notifications:", err);
      setNotifications([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Owner Notifications</h2>

      {loading ? (
        <p>Loading...</p>
      ) : !Array.isArray(notifications) || notifications.length === 0 ? (
        <p className="text-muted">No notifications yet.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 mb-3 rounded shadow-sm ${
              n.status === "unread" ? "bg-light border-start border-4 border-danger" : "bg-white"
            }`}
            style={{ borderLeftWidth: "5px" }}
          >
            <div className="fw-semibold">{n.message}</div>
            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              {new Date(n.created_at).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OwnerNotifications;
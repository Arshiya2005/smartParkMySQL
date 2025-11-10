import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useBookingReminders from "../../hooks/useBookingReminders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const CustomerNotifications = () => {
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📩 Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/notifications`, {
        withCredentials: true,
      });
      console.log("📩 Got:", res.data);
      setNotifications(res.data.notifications); // ✅ now correct
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🕒 Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Your Notifications</h2>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-muted">No notifications yet.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 mb-3 rounded shadow-sm ${
              n.status === "unread"
                ? "bg-light border-start border-4 border-danger"
                : "bg-white"
            }`}
            style={{ borderLeftWidth: "5px" }}
          >
            <div className="fw-semibold">{n.message}</div>
            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              {formatDate(n.created_at)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerNotifications;
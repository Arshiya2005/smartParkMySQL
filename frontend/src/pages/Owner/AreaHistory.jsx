import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useOwnerNotifications from "../../hooks/useOwnerNotifications";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const AreaHistory = () => {
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
  const location = useLocation();
  const navigate = useNavigate();
  const area = location.state?.area;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!area) {
      setError("No area data provided.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/owner/bookingHistoryInArea?area=${encodeURIComponent(
            JSON.stringify(area)
          )}`,
          { credentials: "include" }
        );
        const data = await res.json();
        console.log("📥 Full booking history response:", data);
        if (!res.ok) throw new Error(data.error || "Failed to fetch history");
        setHistory(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [area]);

  const formatTime = (time) => {
    console.log("🕒 Raw time value:", time); // 👈 Logs what you're actually getting
  
    if (!time) return "--:--";
  
    // Try parsing it intelligently
    const date = new Date(`1970-01-01T${time}`);
    if (isNaN(date)) {
      console.warn("⚠️ Invalid time format:", time);
      return "--:--";
    }
  
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }; // HH:mm
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="container py-5" style={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="mb-4 text-center">Booking History – {area?.name}</h2>

      {loading && <div className="text-center">Loading history...</div>}

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="text-center text-muted">No past bookings found.</div>
      )}

<div className="table-responsive">
  {history.length > 0 && (
    <table className="table table-bordered table-striped shadow-sm bg-white">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Slot No</th>
          <th>Type</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  {history.map((b) => (
    <tr
      key={b.id}
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/owner/booking/details", { state: { booking: b } })}
    >
      <td>{b.id}</td>
      <td>{formatDate(b.date)}</td>
      <td>{b.slot_no}</td>
      <td>{b.type}</td>
      <td>{formatTime(b.sTime)}</td>
      <td>{formatTime(b.eTime)}</td>
      <td>{b.status}</td>
    </tr>
  ))}
</tbody>
    </table>
  )}
</div>
    </div>
  );
};

export default AreaHistory;
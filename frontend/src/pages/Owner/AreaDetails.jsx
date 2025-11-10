import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useOwnerNotifications from "../../hooks/useOwnerNotifications";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const AreaDetails = () => {
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
  const { id } = useParams();
  const [area, setArea] = useState(null);
  const [slotStats, setSlotStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Fetch Area Details
        const res1 = await fetch(`${BASE_URL}/owner/parkingAreas`, {
          credentials: "include",
        });
        const allAreas = await res1.json();
        if (!res1.ok) throw new Error(allAreas.error);

        const selected = allAreas.data.find((a) => a.id === id || a.id === parseInt(id));
        if (!selected) throw new Error("Area not found or unauthorized");
        setArea(selected);

        const encoded = encodeURIComponent(JSON.stringify(selected));

        // 2. Fetch Slot Stats
        const res2 = await fetch(`${BASE_URL}/owner/availableSlot?area=${encoded}`, {
          credentials: "include",
        });
        const slotData = await res2.json();
        if (!res2.ok) throw new Error(slotData.error);
        setSlotStats(slotData);

        // 3. Fetch Bookings
        const res3 = await fetch(`${BASE_URL}/owner/activeBookingInArea?area=${encoded}`, {
          credentials: "include",
        });
        const bookingData = await res3.json();
        if (!res3.ok) throw new Error(bookingData.error);
        setBookings(bookingData.data || []);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ backgroundColor: "#f6d6bd", minHeight: "100vh" }}>
      {/* Area Info */}
      <div className="card p-4 shadow mb-4" style={{ backgroundColor: "#fff", borderRadius: "12px" }}>
        <h3 className="mb-3">{area.name}</h3>
        <p><strong>ID:</strong> {area.id}</p>
        <p><strong>Latitude:</strong> {area.lat}</p>
        <p><strong>Longitude:</strong> {area.lon}</p>
        <p><strong>Bike Slots:</strong> {slotStats?.bikedata?.occ} / {slotStats?.bikedata?.bike}</p>
        <p><strong>Car Slots:</strong> {slotStats?.cardata?.occ} / {slotStats?.cardata?.car}</p>
      </div>

      {/* Active Bookings */}
      <div className="card p-4 shadow" style={{ backgroundColor: "#fff", borderRadius: "12px" }}>
        <h4>Today's Active Bookings</h4>
        {bookings.length === 0 ? (
          <p className="text-muted">No active bookings for today in this area.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {bookings.map((booking) => (
              <li key={booking.id} className="list-group-item">
                <strong>Slot #{booking.slot_no}</strong> – {booking.type} – {booking.sTime} to {booking.eTime}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AreaDetails;
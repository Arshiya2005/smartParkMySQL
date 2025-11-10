import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useOwnerNotifications from "../../hooks/useOwnerNotifications";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AreaActiveBookings = () => {
  useAuthRedirect("owner");
  const [ownerId, setOwnerId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const area = location.state?.area;

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
        }
      } catch (err) {
        console.error("Error fetching owner:", err);
      }
    };
    fetchOwner();
  }, []);

  useOwnerNotifications(ownerId);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!area) {
        setError("No area data provided.");
        setLoading(false);
        return;
      }

      try {
        const encoded = encodeURIComponent(JSON.stringify(area));
        const res = await fetch(`${BASE_URL}/owner/activeBookingInArea?area=${encoded}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setBookings(data.data || []);
        } else {
          setError(data.error || "Failed to fetch bookings.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [area]);

  const handleBookingClick = async (booking) => {
    try {
      const encoded = encodeURIComponent(JSON.stringify(booking));
      const res = await fetch(`${BASE_URL}/owner/Specificbooking?book=${encoded}`, {
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/owner/booking/details", { state: data });
      } else {
        alert(data?.error || "Failed to load booking details");
      }
    } catch (err) {
      console.error("Error fetching specific booking:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Today's Bookings – {area?.name}</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-muted text-center">No bookings for today.</div>
      ) : (
        <ul className="list-group shadow-sm">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="list-group-item d-flex justify-content-between align-items-center clickable"
              style={{ cursor: "pointer" }}
              onClick={() => handleBookingClick(booking)}
            >
              <span>
                <strong>Slot #{booking.slot_no}</strong> – {booking.type}
              </span>
              <span>{booking.sTime} to {booking.eTime}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="text-center mt-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default AreaActiveBookings;
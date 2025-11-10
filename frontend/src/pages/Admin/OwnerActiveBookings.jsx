import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const OwnerActiveBookings = () => {
    useAuthRedirect("admin");
  const { owner } = useOutletContext();
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [activeBookings, setActiveBookings] = useState([]);

  // Fetch areas owned by the current owner
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/ownerAreas?id=${owner.id}`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("📦 Areas Response inside fectchAreas inside active bookings :", data);
        if (res.ok && data.data) {
          setAreas(data.data);
        } else {
          setAreas([]);
        }
      } catch (err) {
        console.error("Error fetching owner areas:", err);
      }
    };

    fetchAreas();
  }, [owner.id]);

  // Fetch active bookings once an area is selected
  useEffect(() => {
    if (!selectedArea) return;

    const fetchActiveBookings = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/admin/areaActiveBookings?id=${selectedArea}`,
          { credentials: "include" }
        );
        const data = await res.json();
        console.log("📦 Response in fetch active bookings:", data);
        if (res.ok && data.data) {
          setActiveBookings(data.data);
        } else {
          setActiveBookings([]);
        }
      } catch (err) {
        console.error("Error fetching active bookings:", err);
      }
    };

    fetchActiveBookings();
  }, [selectedArea]);

  return (
    <div className="mt-3">
      <h4 className="mb-2">
        🔵 Active Bookings for{" "}
        <span className="text-primary">
          {owner.fname} {owner.lname}
        </span>{" "}
        <small className="text-muted ms-2">({owner.username})</small>
      </h4>

      <div className="mb-3">
        <label htmlFor="areaSelect" className="form-label fw-semibold">Select Area</label>
        <select
          className="form-select"
          id="areaSelect"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <option value="">-- Choose a Parking Area --</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      {selectedArea ? (
        activeBookings.length === 0 ? (
          <p className="text-muted">No active bookings for this area today.</p>
        ) : (
          <div className="table-responsive border rounded shadow-sm mt-3">
            <table className="table table-sm table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
  {activeBookings.map((b, i) => (
    <tr key={b.id || i}>
      <td>{i + 1}</td>
      <td>{b.vehicle_id}</td>  {/* Replace with number if available */}
      <td>{new Date(b.date).toLocaleDateString()}</td>
      <td>{b.sTime}</td>
      <td>{b.eTime}</td>
      <td>
        <span className="badge bg-success">{b.status}</span>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        )
      ) : (
        <p className="text-muted">Please select a parking area above to view bookings.</p>
      )}
    </div>
  );
};

export default OwnerActiveBookings;
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const OwnerBookingHistory = () => {
    useAuthRedirect("admin");
  const { owner } = useOutletContext();
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [history, setHistory] = useState([]);

  // Fetch areas belonging to this owner
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/ownerAreas?id=${owner.id}`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("📦 Areas Response in fetch areas function inside owner booking history:", data);
        if (res.ok && data.data) {
          setAreas(data.data);
        }
      } catch (error) {
        console.error("Error fetching owner areas:", error);
      }
    };

    fetchAreas();
  }, [owner.id]);

  // Fetch booking history for selected area
  useEffect(() => {
    if (!selectedArea) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/areaBookingHistory?id=${selectedArea}`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("📦 Response in fetch hisotry function:", data);
        if (res.ok && data.data) {
          setHistory(data.data);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error("Error fetching booking history:", error);
      }
    };

    fetchHistory();
  }, [selectedArea]);

  return (
    <div className="mt-3">
      <h4 className="mb-3">
        📚 Booking History for{" "}
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

      {!selectedArea ? (
        <p className="text-muted">Please select a parking area to view its history.</p>
      ) : history.length === 0 ? (
        <p className="text-muted">No bookings found for this area.</p>
      ) : (
        <div className="table-responsive border rounded shadow-sm">
          <table className="table table-sm table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Vehicle ID</th>
              </tr>
            </thead>
            <tbody>
              {history.map((b, i) => (
                <tr key={b.id || i}>
                  <td>{i + 1}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.sTime}</td>
                  <td>{b.eTime}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.status === "active"
                          ? "bg-success"
                          : b.status === "completed"
                          ? "bg-secondary"
                          : "bg-danger"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>{b.vehicle_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OwnerBookingHistory;
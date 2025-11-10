import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const SpecificCustActive = () => {
    useAuthRedirect("admin");
  const { customer } = useOutletContext();
  const [activeBookings, setActiveBookings] = useState([]);

  useEffect(() => {
    const fetchActiveBookings = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/admin/customerActiveBooking?id=${customer.id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("Fetched data form fetch active bookings:", data);
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
  }, [customer.id]);

  return (
    <div className="mt-3">
      <h4 className="mb-3">
        🧍 Active Bookings for{" "}
        <span className="text-primary">
          {customer.fname} {customer.lname}
        </span>
      </h4>

      {activeBookings.length === 0 ? (
        <p className="text-muted">No active bookings today.</p>
      ) : (
        <div className="table-responsive border rounded shadow-sm">
          <table className="table table-sm table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Slot ID</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeBookings.map((b, i) => (
                <tr key={b.id || i}>
                  <td>{i + 1}</td>
                  <td>{b.slot_id}</td>
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
      )}
    </div>
  );
};

export default SpecificCustActive;
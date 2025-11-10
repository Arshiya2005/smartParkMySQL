import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const SpecificCustHistory = () => {
    useAuthRedirect("admin");
  const { customer } = useOutletContext();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/admin/customerBookingHistory?id=${customer.id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        console.log("Fetched data from fetchbooking history function:", data);
        if (res.ok && data.data) {
            console.log("Fetched data:", data);
          setHistory(data.data);
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error("Error fetching booking history:", err);
      }
    };

    fetchBookingHistory();
  }, [customer.id]);

  return (
    <div className="mt-3">
      <h4 className="mb-2">
        📚 Booking History for{" "}
        <span className="text-primary">
          {customer.fname} {customer.lname}
        </span>{" "}
        <small className="text-muted ms-2">({customer.username})</small>
      </h4>

      {history.length === 0 ? (
        <p className="text-muted">No booking history found.</p>
      ) : (
        <div className="table-responsive border rounded shadow-sm mt-3">
          <table className="table table-sm table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Slot ID</th>
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
                  <td>{b.slot_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SpecificCustHistory;
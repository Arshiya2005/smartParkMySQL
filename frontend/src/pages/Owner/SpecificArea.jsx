import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useOwnerNotifications from "../../hooks/useOwnerNotifications";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SpecificArea = () => {
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

  const [bikeData, setBikeData] = useState({ occ: 0, bike: 0 });
  const [carData, setCarData] = useState({ occ: 0, car: 0 });
  const [loading, setLoading] = useState(true);
  const [bikeInput, setBikeInput] = useState(area?.bike || 0);
  const [carInput, setCarInput] = useState(area?.car || 0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!area) return;

    const fetchSlotData = async () => {
      try {
        const encodedArea = encodeURIComponent(JSON.stringify(area));

        const res = await fetch(
          `${BASE_URL}/owner/availableSlot?area=${encodedArea}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setBikeData(data.bikedata);
          setCarData(data.cardata);
        } else {
          console.error("Slot data fetch failed:", data.error);
        }
      } catch (err) {
        console.error("Error fetching slot data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlotData();
  }, [area]);

  const handleSlotChange = async () => {
    if (bikeInput === area.bike && carInput === area.car) {
      setMessage("No changes made to slot counts.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/owner/changeSlotCount`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bike: bikeInput,
          car: carInput,
          area,
        }),
      });

      const data = await res.json();
      setMessage(data.message || "Slot update requested.");
    } catch (err) {
      console.error("Slot update error:", err);
      setMessage(data.message || "Failed to request slot update.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/owner/deleteArea`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ area }),
      });

      const data = await res.json();
      setMessage(data.message || "Area delete request sent.");
    } catch (err) {
      console.error("Area delete error:", err);
      setMessage("Failed to request area deletion.");
    }
  };

  const chartData = [
    {
      type: "Bike",
      Empty: Math.max(0, bikeData.bike - bikeData.occ),
      Occupied: bikeData.occ,
    },
    {
      type: "Car",
      Empty: Math.max(0, carData.car - carData.occ),
      Occupied: carData.occ,
    },
  ];

  if (!area) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">No area data found. Please try again from My Areas.</div>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/owner/myAreas")}>
          Back to My Areas
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 d-flex flex-column align-items-center gap-4">
      <button className="btn btn-outline-dark align-self-start" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="mb-3 text-center">Slot Usage – {area.name}</h2>

      {loading ? (
        <p>Loading slot availability...</p>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Empty" stackId="a" fill="#82ca9d" />
              <Bar dataKey="Occupied" stackId="a" fill="#ff6f61" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/owner/areaActiveBookings", { state: { area } })}
        >
          Active Bookings
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/owner/areaHistory", { state: { area } })}
        >
          View Booking History
        </button>
      </div>

      <div className="mt-4 p-3 border rounded shadow-sm w-100" style={{ maxWidth: 500 }}>
        <h5>Change Slot Count</h5>
        <div className="row mb-2">
          <label className="col-3 col-form-label">Bike:</label>
          <div className="col">
            <input
              type="number"
              className="form-control"
              value={bikeInput}
              onChange={(e) => setBikeInput(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-3 col-form-label">Car:</label>
          <div className="col">
            <input
              type="number"
              className="form-control"
              value={carInput}
              onChange={(e) => setCarInput(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>
        <button className="btn btn-success w-100" onClick={handleSlotChange}>
          Submit Slot Change Request
        </button>
      </div>

      <div className="mt-4">
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete Area
        </button>
      </div>

      {message && (
        <div className="alert alert-info mt-3 text-center w-100">{message}</div>
      )}
    </div>
  );
};

export default SpecificArea;
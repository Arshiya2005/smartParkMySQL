import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useBookingReminders from "../../hooks/useBookingReminders";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const BookingForm = () => {
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
  const [vehicles, setVehicles] = useState([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: "", no: "", type: "car" });
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const [useGPS, setUseGPS] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [coords, setCoords] = useState({ lat: null, lon: null });

  const [isLoading, setIsLoading] = useState(false); // 🟡 Spinner loading state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/customer/profile/myVehicles`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setVehicles(data.data);
        else console.error("Failed to load vehicles");
      } catch (err) {
        console.error("Vehicle fetch error:", err);
      }
    };
    fetchVehicles();
  }, []);

  const handleAddVehicle = async () => {
    try {
      const res = await fetch(`${BASE_URL}/customer/profile/myVehicles/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newVehicle),
      });
      if (res.ok) {
        alert("Vehicle added successfully");
        const updated = await res.json();
        setVehicles((prev) => [...prev, updated]);
        setShowAddVehicle(false);
        setNewVehicle({ name: "", no: "", type: "car" });
      } else {
        alert("Failed to add vehicle");
      }
    } catch (err) {
      console.error("Add vehicle error:", err);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        alert("Current location set successfully!");
      },
      (err) => {
        console.error("Geolocation error:", err);
        if (err.code === 1) {
          alert("Permission denied. Please allow location access.");
        } else if (err.code === 2) {
          alert("Location unavailable. Please try again or enter manually.");
        } else if (err.code === 3) {
          alert("Location request timed out. Try again.");
        } else {
          alert("Unknown geolocation error occurred.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearchNearby = async () => {
    const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
    if (!vehicle) return alert("Please select a vehicle");

    try {
      setIsLoading(true); // 🔵 Start spinner

      let body;
      if (useGPS) {
        if (!coords.lat || !coords.lon) {
          setIsLoading(false);
          return alert("Please click 'Use My Location' to fetch coordinates.");
        }
        body = { lat: coords.lat, lon: coords.lon, id: vehicle.id, type: vehicle.type };
      } else {
        if (!manualLocation.trim()) {
          setIsLoading(false);
          return alert("Please enter a location");
        }
        body = { location: manualLocation.trim(), id: vehicle.id, type: vehicle.type };
      }

      const res = await fetch(`${BASE_URL}/customer/searchNearby`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/customer/nearby", { state: { data } });
      } else {
        alert(data.message || "Failed to fetch nearby slots");
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsLoading(false); // 🔴 Stop spinner
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Book a Parking Slot</h3>

      {/* VEHICLE SELECTION */}
      <div className="mb-3">
        <label className="form-label">Select Vehicle</label>
        {vehicles.length === 0 ? (
          <p>
            No vehicles found.{" "}
            <button className="btn btn-link p-0" onClick={() => setShowAddVehicle(true)}>
              Add Vehicle
            </button>
          </p>
        ) : (
          <select
            className="form-select"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
          >
            <option value="">-- Choose a vehicle --</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.model} ({v.number})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ADD VEHICLE FORM */}
      {showAddVehicle && (
        <div className="mb-3">
          <h5>Add New Vehicle</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Vehicle Model"
            value={newVehicle.name}
            onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Vehicle Number"
            value={newVehicle.no}
            onChange={(e) => setNewVehicle({ ...newVehicle, no: e.target.value })}
          />
          <select
            className="form-select mb-2"
            value={newVehicle.type}
            onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
          >
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
          <button className="btn btn-success" onClick={handleAddVehicle}>
            Add
          </button>
        </div>
      )}

      {/* LOCATION INPUT TOGGLE */}
      <div className="mb-3">
        <label className="form-label">Choose Location Method</label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="locationMode"
            id="manualRadio"
            checked={!useGPS}
            onChange={() => setUseGPS(false)}
          />
          <label className="form-check-label" htmlFor="manualRadio">
            Enter Location Manually
          </label>
        </div>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="locationMode"
            id="gpsRadio"
            checked={useGPS}
            onChange={() => setUseGPS(true)}
          />
          <label className="form-check-label" htmlFor="gpsRadio">
            Use My Current Location
          </label>
        </div>
      </div>

      {/* LOCATION INPUTS */}
      {!useGPS ? (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Eg. MG Road, Pune"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
          />
        </div>
      ) : (
        <div className="mb-3">
          <button className="btn btn-outline-primary mb-2" onClick={handleUseCurrentLocation}>
            Get My Current Location
          </button>
          {coords.lat && coords.lon ? (
            <input
              type="text"
              className="form-control"
              value={`Latitude: ${coords.lat}, Longitude: ${coords.lon}`}
              disabled
            />
          ) : (
            <input className="form-control" disabled placeholder="Location not fetched yet" />
          )}
        </div>
      )}

      {/* PROCEED BUTTON WITH SPINNER */}
      <button className="btn btn-primary" onClick={handleSearchNearby} disabled={isLoading}>
        {isLoading && (
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />
        )}
        {isLoading ? "Searching..." : "Proceed"}
      </button>
    </div>
  );
};

export default BookingForm;
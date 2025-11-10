import React, { useState , useEffect} from "react";
import NavBarOwner from "../../components/owner/NavBarOwner";
import green from "../../assets/green_back.jpg"
import useAuthRedirect from "../../hooks/useAuthRedirect";
import useOwnerNotifications from "../../hooks/useOwnerNotifications";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const AddArea = () => {
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
  const [formData, setFormData] = useState({
    name: "",
    lon: "",
    lat: "",
    bike: "",
    car: "",
  });

  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          lat: latitude.toFixed(6),
          lon: longitude.toFixed(6),
        }));
      },
      (error) => {
        alert("Failed to detect location: " + error.message);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const res = await fetch(`${BASE_URL}/owner/addArea`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const response = await res.json();

      if (res.ok) {
        setStatus({ loading: false, success: "Area added successfully!", error: null });
        setFormData({ name: "", lon: "", lat: "", bike: "", car: "" });
      } else {
        setStatus({ loading: false, success: null, error: response.error || "Failed to add area." });
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      setStatus({ loading: false, success: null, error: "Server error. Please try again." });
    }
  };

  const totalSlots = Number(formData.bike || 0) + Number(formData.car || 0);

  return (
    <>
    <NavBarOwner/>
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${green})`, // 🍑 Peach background
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
    >
      <div className="container" style={{ maxWidth: "650px" }}>
        <h2 className="mb-4 text-center">Add a New Parking Area</h2>

        <form
          onSubmit={handleSubmit}
          className="card p-4 shadow-lg rounded-4"
          style={{
            backgroundColor: "#ffffff", // White card
            minHeight: "500px",
          }}
        >
          {/* Area Name */}
          <div className="mb-3">
            <label className="form-label">Area Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Latitude & Longitude + Detect */}
          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                className="form-control"
                name="lon"
                value={formData.lon}
                onChange={handleChange}
                required
                step="any"
              />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                className="form-control"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                required
                step="any"
              />
            </div>
          </div>

          {/* Location Button */}
          <div className="text-center mb-3">
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={handleLocationDetect}
            >
              📍 Detect My Current Location
            </button>
          </div>

          {/* Bike & Car Slots */}
          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label">Bike Slots</label>
              <input
                type="number"
                className="form-control"
                name="bike"
                value={formData.bike}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label">Car Slots</label>
              <input
                type="number"
                className="form-control"
                name="car"
                value={formData.car}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          {/* Total */}
          <div className="mb-3 text-center">
            <strong>Total Slots:</strong> {totalSlots}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-dark w-100" disabled={status.loading}>
            {status.loading ? "Adding..." : "Add Area"}
          </button>

          {/* Feedback */}
          {status.success && (
            <div className="alert alert-success mt-3 text-center">{status.success}</div>
          )}
          {status.error && (
            <div className="alert alert-danger mt-3 text-center">{status.error}</div>
          )}
        </form>
      </div>
    </div>
    </>
    
  );
};

export default AddArea;
import React, { useEffect, useState } from "react";
import green from "../../assets/green_back.jpg";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import socket from "../../socket";
import useOwnerNotifications from "../../hooks/useOwnerNotifications"; // 🔌 Import socket instance
const BASE_URL = import.meta.env.VITE_BASE_URL;
const OwnerInfo = () => {
  useAuthRedirect("owner");
  const [ownerId, setOwnerId] = useState(null);
  const [info, setInfo] = useState(null);
  const [newFname, setNewFname] = useState("");
  const [newLname, setNewLname] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`${BASE_URL}/owner/profile/info`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setInfo(data.data);
          setNewFname(data.data.fname);
          setNewLname(data.data.lname);
        } else {
          console.error("Failed to fetch owner profile info");
        }
      } catch (err) {
        console.error("Error fetching profile info:", err);
      }
    };

    fetchInfo();
  }, []);

  const handleEditFname = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/owner/profile/info/editFname`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fname: newFname }),
      });
      if (res.ok) {
        alert("First name updated successfully");
        setInfo((prev) => ({ ...prev, fname: newFname }));
      } else {
        alert("Failed to update first name");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLname = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/owner/profile/info/editLname`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ lname: newLname }),
      });
      if (res.ok) {
        alert("Last name updated successfully");
        setInfo((prev) => ({ ...prev, lname: newLname }));
      } else {
        alert("Failed to update last name");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/logout`, {
        method: "GET",
        credentials: "include",
      });
  
      if (res.ok) {
        // ✅ Disconnect from socket
        if (socket.connected) {
          socket.disconnect();
          socket.removeAllListeners();
          console.log("🛑 Socket disconnected and listeners removed (owner logout)");
        }
  
        alert("Logged out successfully!");
        window.location.href = "/login?type=owner"; // Redirect to owner login
      } else {
        alert("Failed to logout.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Something went wrong.");
    }
  };

  if (!info) return <p>Loading owner info...</p>;

  return (
    <div
  className="d-flex justify-content-center align-items-center"
  style={{
    height: "100vh",
    width: "100vw",
    backgroundImage: `url(${green})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    margin: 0,
    padding: 0,
  }}
>
      <div
        className="card p-4 shadow"
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "12px",
          height: "70vh",
          backgroundColor: "rgba(255,255,255,0.95)", // Optional for better blending
        }}
      >
        <h3 className="mb-4 text-center">Owner Info</h3>

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={newFname}
              onChange={(e) => setNewFname(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleEditFname}
              disabled={loading}
              style={{ backgroundColor: "#2C786C" }}
            >
              Update
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={newLname}
              onChange={(e) => setNewLname(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleEditLname}
              disabled={loading}
              style={{ backgroundColor: "#2C786C" }}
            >
              Update
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={info.username} disabled />
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-danger d-flex align-items-center justify-content-center gap-2 mx-auto"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerInfo;
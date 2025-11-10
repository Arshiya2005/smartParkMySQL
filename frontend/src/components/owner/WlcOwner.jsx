import React, { useEffect, useState } from "react";
import ownerImg from "../../assets/owner_welcome.svg"; // Add an appropriate owner SVG
const BASE_URL = import.meta.env.VITE_BASE_URL;
const WlcCardOwner = () => {
  const [name, setName] = useState(null); // null = loading

  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const res = await fetch(`${BASE_URL}/owner/welcome`, {
          credentials: "include",
        });

        const response = await res.json();
        console.log("🔍 Data received from /owner/welcome:", response);

        const data = response.data;

        if (res.ok && data?.fname && data?.lname) {
          setName({ fname: data.fname, lname: data.lname });
        } else {
          console.warn("⚠️ Missing fname or lname in response:", data);
          setName({ fname: "", lname: "" });
        }
      } catch (err) {
        console.error("❌ Error fetching welcome data:", err);
        setName({ fname: "", lname: "" });
      }
    };

    fetchWelcome();
  }, []);

  if (name === null) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  const displayName = `${name?.fname || ""} ${name?.lname || ""}`.trim() || "Guest";

  return (
    <div
      className="card shadow-lg mb-4 p-4"
      style={{
        backgroundColor: "#FDF7FA", // Light tone to contrast customer card
        color: "#13070C", // Licorice from your palette
        borderRadius: "12px",
      }}
    >
      <div className="row align-items-center">
        {/* Image */}
        <div className="col-12 col-md-5 text-center mb-3 mb-md-0">
          <img
            src={ownerImg}
            alt="Owner Illustration"
            style={{ maxHeight: "180px", width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Text */}
        <div className="col-12 col-md-7 text-md-start text-center">
          <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
            Welcome back, {displayName}!
          </h2>
          <p style={{ fontSize: "1.3rem", fontWeight: 500 }}>
            Your parking area awaits.
            <br />
            Ready to manage it like a pro?
          </p>
        </div>
      </div>
    </div>
  );
};

export default WlcCardOwner;
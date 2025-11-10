import React, { useEffect, useState } from "react";
import scooty from "../assets/girl_scooty.svg";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const WlcCardCustomer = () => {
  const [name, setName] = useState(null); // null = loading

  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const res = await fetch(`${BASE_URL}/customer/welcome`, {
          credentials: "include",
        });
  
        const response = await res.json();
        console.log("🔍 Data received from /customer/welcome:", response);
  
        const data = response.data; // ✅ extract inner data
  
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
        backgroundColor: "#F7FFF7",
        color: "#1B1B1E",
        borderRadius: "12px",
      }}
    >
      <div className="row align-items-center">
        {/* Image */}
        <div className="col-12 col-md-5 text-center mb-3 mb-md-0">
          <img
            src={scooty}
            alt="Scooty Illustration"
            style={{ maxHeight: "180px", width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Text */}
        <div className="col-12 col-md-7 text-md-start text-center">
          <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
            Welcome, {displayName}!
          </h2>
          <p style={{ fontSize: "1.3rem", fontWeight: 500 }}>
            We're glad to have you back.
            <br />
            Ready to park smarter today?
          </p>
        </div>
      </div>
    </div>
  );
};

export default WlcCardCustomer;

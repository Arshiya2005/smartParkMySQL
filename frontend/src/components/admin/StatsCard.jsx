import React, { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const StatsCard = () => {
  const [stats, setStats] = useState({
    custCount: 0,
    ownCount: 0,
    bookCount: 0,
    bikeSlots: 0,
    carSlots: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/welcome`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setStats(data);
        } else {
          console.warn("❌ Failed to fetch stats:", data.error);
        }
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="card shadow p-4 border-0" style={{ borderRadius: "16px" }}>
  <h4 className="mb-4 fw-bold text-primary">
    📊 System Statistics Overview
  </h4>
  <div className="row g-4 text-center">
    <div className="col-md-4">
      <div className="bg-light rounded p-3 shadow-sm">
        <h6 className="text-secondary">Total Customers</h6>
        <p className="fs-3 fw-bold text-dark">{stats.custCount}</p>
      </div>
    </div>
    <div className="col-md-4">
      <div className="bg-light rounded p-3 shadow-sm">
        <h6 className="text-secondary">Total Owners</h6>
        <p className="fs-3 fw-bold text-dark">{stats.ownCount}</p>
      </div>
    </div>
    <div className="col-md-4">
      <div className="bg-light rounded p-3 shadow-sm">
        <h6 className="text-secondary">Total Bookings</h6>
        <p className="fs-3 fw-bold text-dark">{stats.bookCount}</p>
      </div>
    </div>
    <div className="col-md-6">
      <div className="bg-light rounded p-3 shadow-sm">
        <h6 className="text-secondary">Total Bike Slots</h6>
        <p className="fs-3 fw-bold text-dark">{stats.bikeSlots}</p>
      </div>
    </div>
    <div className="col-md-6">
      <div className="bg-light rounded p-3 shadow-sm">
        <h6 className="text-secondary">Total Car Slots</h6>
        <p className="fs-3 fw-bold text-dark">{stats.carSlots}</p>
      </div>
    </div>
  </div>
</div>
  );
};

export default StatsCard;
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const OwnerAreas = () => {
    useAuthRedirect("admin");
  const { owner } = useOutletContext();
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/admin/ownerAreas?id=${owner.id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        console.log("Fetched data in function fetchareas:", data);
        if (res.ok && data.data) {
          setAreas(data.data);
        } else {
          setAreas([]);
        }
      } catch (err) {
        console.error("Error fetching owner areas:", err);
      }
    };

    fetchAreas();
  }, [owner.id]);

  return (
    <div className="mt-3">
      <h4 className="mb-3">
        🏘️ Areas Owned by{" "}
        <span className="text-primary">
          {owner.fname} {owner.lname}
        </span>{" "}
        <small className="text-muted ms-2">({owner.username})</small>
      </h4>

      {areas.length === 0 ? (
        <p className="text-muted">No parking areas registered by this owner.</p>
      ) : (
        <div className="table-responsive border rounded shadow-sm">
          <table className="table table-sm table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Area Name</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Bike Slots</th>
                <th>Car Slots</th>
                <th>isActive</th>
                <th>Created On</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area, i) => (
                <tr key={area.id || i}>
                  <td>{i + 1}</td>
                  <td>{area.name}</td>
                  <td>{area.lat.toFixed(4)}</td>
                  <td>{area.lon.toFixed(4)}</td>
                  <td>{area.bike}</td>
                  <td>{area.car}</td>
                  <td>{area.is_active == 0 ? "NO" : "Yes"}</td>
                  <td>{new Date(area.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OwnerAreas;
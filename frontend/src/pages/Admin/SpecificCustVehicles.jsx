import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const SpecificCustVehicles = () => {
    useAuthRedirect("admin");
  const { customer } = useOutletContext();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/admin/customerVehicles?id=${customer.id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("Fetched data from fetch vehicles function:", data);
        if (res.ok && data.data) {
          setVehicles(data.data);
        } else {
            console.log("inside else block");
          setVehicles([]);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, [customer.id]);

  return (
    <div className="mt-3">
      <h4 className="mb-3">
        🚗 Registered Vehicles for{" "}
        <span className="text-primary">
          {customer.fname} {customer.lname}
        </span>
      </h4>
      {vehicles.length === 0 ? (
        <p className="text-muted">No vehicles registered by this customer.</p>
      ) : (
        <div className="table-responsive border rounded shadow-sm">
          <table className="table table-sm table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Vehicle Number</th>
                <th>Type</th>
                <th>Model</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={v.id || i}>
                  <td>{i + 1}</td>
                  <td>{v.number}</td>
                  <td>{v.type}</td>
                  <td>{v.model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SpecificCustVehicles;
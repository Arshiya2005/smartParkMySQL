import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const OwnerManagement = () => {
  useAuthRedirect("admin");
  const [owners, setOwners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/ownerInfo`, {
          credentials: "include",
        });

        const { data } = await res.json();
        if (res.ok) {
          setOwners(data || []);
        } else {
          console.error("Failed to fetch owners.");
        }
      } catch (error) {
        console.error("Error fetching owner data:", error);
      }
    };

    fetchOwners();
  }, []);

  const handleRowClick = (owner) => {
    localStorage.setItem("selectedOwner", JSON.stringify(owner));
    navigate("/admin/specificOwner");
  };

  return (
    <>
      <AdminNavBar />
      <div className="container mt-4">
        <h3 className="mb-4">🧑‍💼 Owner Management</h3>
        {owners.length === 0 ? (
          <p>No owners found.</p>
        ) : (
          <div className="table-responsive shadow-sm border rounded">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Username (Email)</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner, index) => (
                  <tr
                    key={owner.id || index}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(owner)}
                  >
                    <td>{index + 1}</td>
                    <td>{owner.fname} {owner.lname}</td>
                    <td>{owner.username}</td>
                    <td>{new Date(owner.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default OwnerManagement;
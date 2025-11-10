import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const AdminProfile = () => {
  useAuthRedirect("admin");
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState(null);
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        alert("Logged out successfully.");
        navigate("/login?type=admin");
      } else {
        const data = await res.json();
        alert(data.error || "Logout failed.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Something went wrong during logout.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, listRes] = await Promise.all([
          fetch(`${BASE_URL}/admin/profile/info`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${BASE_URL}/admin/profile/adminList`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (!infoRes.ok || !listRes.ok) {
          throw new Error("Failed to fetch admin data.");
        }

        const infoData = await infoRes.json();
        const listData = await listRes.json();

        console.log("Admin Info Response:", infoData);
        console.log("Admin List Response:", listData);

        setAdminData(infoData.data);
        setAdminList(listData.data);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Error loading profile or admin list.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading admin profile...</div>;
  }

  return (
    <>
      <AdminNavBar />
      <div className="container mt-5">
        <div className="card shadow p-4 border-0" style={{ borderRadius: "16px" }}>
          <div className="d-flex flex-column align-items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
              alt="Admin Avatar"
              className="rounded-circle mb-3"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <h4 className="fw-bold">{adminData.fname} {adminData.lname}</h4>
            <p className="text-muted mb-1">{adminData.username}</p>
            <span className="badge bg-primary px-3 py-2 mb-3">{adminData.type}</span>

            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
              style={{ fontWeight: "500" }}
            >
              Logout
            </button>
          </div>

          <hr className="my-4" />

          <div>
            <h5 className="mb-2">Profile Details</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>ID:</strong> {adminData.id}
              </li>
              <li className="list-group-item">
                <strong>Name:</strong> {adminData.fname} {adminData.lname}
              </li>
              <li className="list-group-item">
                <strong>Email:</strong> {adminData.username}
              </li>
              <li className="list-group-item">
                <strong>Role:</strong> {adminData.type}
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h5 className="mb-3">All Admins</h5>
            {adminList.length === 0 ? (
              <p className="text-muted">No other admins found.</p>
            ) : (
              <ul className="list-group">
                {adminList.map((admin) => (
                  <li key={admin.id} className="list-group-item">
                    {admin.fname} {admin.lname}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
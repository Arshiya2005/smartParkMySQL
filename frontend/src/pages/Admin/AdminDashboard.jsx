import React from "react";
import AdminNavBar from "../../components/admin/AdminNavBar";
import StatsCard from "../../components/admin/StatsCard";
import OwnerManageCard from "../../components/admin/OwnerManageCard";
import CustomerManageCard from "../../components/admin/CustomerManageCard";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import green from "../../assets/green_back.jpg"; // background image

const AdminDashboard = () => {
  useAuthRedirect("admin");

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${green})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "100vh",
          paddingBottom: "2rem",
        }}
      >
        <AdminNavBar />

        <div className="container py-4">
          <h2 className="mb-4 fw-bold" style={{ color: "#2C786C" }}>
            Welcome, Admin 👋
          </h2>

          {/* Stats Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div
                className="card shadow"
                style={{
                  backgroundColor: "#F7FFF7",
                  border: "1px solid #2C786C",
                  borderRadius: "16px",
                  padding: "1rem",
                }}
              >
                <StatsCard />
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <div
                className="card shadow"
                style={{
                  backgroundColor: "#F7FFF7",
                  border: "1px solid #2C786C",
                  borderRadius: "16px",
                  padding: "1rem",
                }}
              >
                <OwnerManageCard />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div
                className="card shadow"
                style={{
                  backgroundColor: "#F7FFF7",
                  border: "1px solid #2C786C",
                  borderRadius: "16px",
                  padding: "1rem",
                }}
              >
                <CustomerManageCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
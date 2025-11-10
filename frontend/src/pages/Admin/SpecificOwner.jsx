import React from "react";
import { Outlet } from "react-router-dom";
import SpecificOwnerNav from "../../components/admin/SpecificOwnerNav";
import AdminNavBar from "../../components/admin/AdminNavBar";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const SpecificOwner = () => {
    useAuthRedirect("admin");
  const owner = JSON.parse(localStorage.getItem("selectedOwner"));

  if (!owner) {
    return <p className="text-danger">No owner selected. Please go back.</p>;
  }

  return (
    <>
    <AdminNavBar/>
      <div className="container mt-4">
        <h4>
          👤 Viewing Owner:{" "}
          <span className="text-primary">{owner.fname} {owner.lname}</span>{" "}
          <small className="text-muted ms-2">({owner.username})</small>
        </h4>

        <SpecificOwnerNav />
        <Outlet context={{ owner }} />
      </div>
    </>
  );
};

export default SpecificOwner;
import React from 'react';
import { Outlet } from 'react-router-dom';
import SpecificCustomerNav from '../../components/admin/SpecificCustomerNav';
import AdminDashboard from './AdminDashboard';
import AdminNavBar from '../../components/admin/AdminNavBar';
import useAuthRedirect from "../../hooks/useAuthRedirect";
const SpecificCustomer = () => {
    useAuthRedirect("admin");
  const customer = JSON.parse(localStorage.getItem("selectedCustomer"));

  if (!customer) {
    return <p className="text-danger">No customer selected. Please go back.</p>;
  }

  return (
    <>
    <AdminNavBar/>
      <SpecificCustomerNav />
      <div className="container mt-4">
        <Outlet context={{ customer }} />
      </div>
    </>
  );
};

export default SpecificCustomer;
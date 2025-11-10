import React, { useEffect, useState } from "react";
import AdminNavBar from "../../components/admin/AdminNavBar";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const CustomerManagement = () => {
    useAuthRedirect("admin");
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/customerInfo`, {
          credentials: "include",
        });
        const { data } = await res.json();
        if (res.ok) {
          setCustomers(data || []);
        } else {
          console.error("Failed to fetch customers.");
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleRowClick = (customer) => {
    
        localStorage.setItem("selectedCustomer", JSON.stringify(customer));
        navigate("/admin/specificCustomer");
      
  };

  return (
    <>
      <AdminNavBar />
      <div className="container mt-4">
        <h3 className="mb-4">👥 Customer Management</h3>
        {customers.length === 0 ? (
          <p>No customers found.</p>
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
                {customers.map((customer, index) => (
                  <tr
                    key={customer.id || index}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(customer)}
                  >
                    <td>{index + 1}</td>
                    <td>{customer.fname} {customer.lname}</td>
                    <td>{customer.username}</td>
                    <td>{new Date(customer.created_at).toLocaleDateString()}</td>
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

export default CustomerManagement;
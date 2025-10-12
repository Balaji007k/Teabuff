// export default Admin;
import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../components/Service/ApiService/product-api";
import AdminNavbar from './Admin_Component/AdminNavbar';
import DashBoard from './Admin_Component/DashBoard'
import '../Admin_page/assets_Admin/Admin.css'
import { Outlet } from 'react-router-dom';

function Admin({ AllReview, productsItem, category }) {
  const [Users, setUser] = useState([]);
  const [Orders, setOrders] = useState([]);
  const [productStocks, setProductStocks] = useState([]);
  const Location = useLocation();

  const AdminAccess = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    const { Result, Error } = await ApiService.fetchData('/users');
    if (Array.isArray(Result)) {
      setUser(Result);
    } else if (Array.isArray(Result?.users)) {
      setUser(Result.users);
    } else {
      console.error("Unexpected data format:", Error);
    }
  };

  const fetchOrders = async () => {
    const { Result, Error } = await ApiService.fetchData('/AllOrders');
    if (Result) {
      setOrders(Result?.Orders);
    } else {
      console.error("Unexpected data format:", Error);
    }
  };

  const fetchProductStocks = async () => {
    const { Result, Error } = await ApiService.fetchData('/productStocks');
    if (Result) {
      setProductStocks(Result?.productStocks);
    } else {
      console.error("Unexpected data format:", Error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchProductStocks();
  }, []);

  // 🔹 Conditional rendering for admin access
  if (!AdminAccess) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h2 className="text-danger">Admin Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="main-Admin d-flex w-100">
      <AdminNavbar />
      {Location.pathname === '/Admin' && (
        <DashBoard
          Users={Users?.length}
          Review={AllReview?.length}
          productsItem={productsItem?.length}
          productStocks={productStocks?.length}
          category={category?.length}
          Orders={Orders?.length}
        />
      )}
      <Outlet context={{ Users, Orders, productStocks }} />
    </div>
  );
}

export default Admin;

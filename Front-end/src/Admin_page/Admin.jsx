import { Outlet } from 'react-router-dom';
import '../Admin_page/assets_Admin/Admin.css'
import AdminNavbar from './Admin_Component/AdminNavbar';
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import DashBoard from './Admin_Component/DashBoard'
import ApiService from '../components/Service/ApiService/product-api';

function Admin({AllReview, productsItem, category}) {

    const [Users,setUser] = useState([]);
    const Location = useLocation();

    const fetchProducts = async () => {
        const { Result, Error } = await ApiService.fetchData('/users');
        if (Array.isArray(Result)) {
        setUser(Result);
      } else if (Array.isArray(Result.users)) {
        setUser(Result.users);
      } else {
        console.error("Unexpected data format:", Error);
      }
    };


    useEffect(()=>{

    fetchProducts();

  // fetch(`https://teabuff.onrender.com/users`)
  //   .then(res => res.json())
  //   .then(data => {
  //     if (Array.isArray(data)) {
  //       setUser(data);
  //     } else if (Array.isArray(data.users)) {
  //       setUser(data.users);
  //     } else {
  //       console.error("Unexpected data format:", data);
  //     }
  //   })
  //   .catch(err => console.error("Fetch error:", err));
}, []);

    return (
        <div className='main-Admin d-flex w-100'>
            <AdminNavbar/>
            {Location.pathname === '/Admin'&&<DashBoard Users={Users} AllReview={AllReview} productsItem={productsItem} category={category}/>}
            <Outlet context={Users}/>
        </div>
    )
}

export default Admin;
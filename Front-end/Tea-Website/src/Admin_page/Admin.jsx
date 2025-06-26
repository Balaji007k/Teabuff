import { Outlet } from 'react-router-dom';
import '../Admin_page/assets_Admin/Admin.css'
import AdminNavbar from './Admin_Component/AdminNavbar';
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import DashBoard from './Admin_Component/DashBoard'

function Admin({Review, productsItem, category}) {

    const [Users,setUser] = useState([]);
    const Location = useLocation();

    useEffect(()=>{
  fetch(`http://localhost:5000/users`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setUser(data);
      } else if (Array.isArray(data.users)) {
        setUser(data.users);
      } else {
        console.error("Unexpected data format:", data);
      }
    })
    .catch(err => console.error("Fetch error:", err));
}, []);

    return (
        <div className='main-Admin d-flex w-100'>
            <AdminNavbar/>
            {Location.pathname === '/Admin'&&<DashBoard Users={Users} Review={Review} productsItem={productsItem} category={category}/>}
            <Outlet context={Users}/>
        </div>
    )
}

export default Admin;
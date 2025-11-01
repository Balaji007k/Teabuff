import { Link } from "react-router-dom";
import "../assets_Admin/AdminNavbar.css"; // custom styles

function AdminNavbar() {
  return (
    <nav className="admin-navbar d-flex flex-column p-3">
      <ul className="nav flex-column gap-3">
        <li className="nav-item">
          <Link to="/Admin" className="nav-link">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/Admin/UserDetails" className="nav-link">User Details</Link>
        </li>
        <li className="nav-item">
          <Link to="/Admin/Products" className="nav-link">Products</Link>
        </li>
        <li className="nav-item">
          <Link to="/Admin/ProductStocks" className="nav-link">ProductStocks</Link>
        </li>
        <li className="nav-item">
          <Link to="/Admin/Reviews" className="nav-link">Reviews</Link>
        </li>
        <li className="nav-item">
          <Link to="/Admin/Categorys" className="nav-link">Categories/Offers</Link>
        </li>
        <li className="nav-item">
          <Link to="/Admin/Orders" className="nav-link">Orders</Link>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;



// import { Link } from 'react-router-dom';

// function AdminNavbar() {
//   return (
//     <nav className="admin-navbar p-3">
//       <ul className="nav-list">
//         <Link to="/Admin">DashBoard</Link>
//         <Link to="/Admin/UserDetails">UserDetails</Link>
//         <Link to="/Admin/Products">Products</Link>
//         <Link to="/Admin/Reviews">Reviews</Link>
//         <Link to="/Admin/Categorys">Categorys</Link>
//       </ul>
//     </nav>
//   );
// }

// export default AdminNavbar;

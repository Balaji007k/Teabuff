import { Link } from 'react-router-dom';

function DashBoard({ Review, productsItem, productStocks, category, Users, Orders }) {
  return (
    <div className="main-Admin-dashboard">
      <div className="dashboard-grid">
        <div className="Dashboard">
          <h1>
            <Link to="/Admin/UserDetails">Users {Users}</Link>
          </h1>
        </div>
        <div className="Dashboard">
          <h1>
            <Link to="/Admin/Products">Products {productsItem}</Link>
          </h1>
        </div>
        <div className="Dashboard">
          <h1>
            <Link to="/Admin/ProductStocks">ProductStocks {productStocks}</Link>
          </h1>
        </div>
        <div className="Dashboard">
          <h1>
            <Link to="/Admin/Reviews">Reviews {Review}</Link>
          </h1>
        </div>
        <div className="Dashboard">
          <h1>
            <Link to="/Admin/Categorys">Categorys {category}</Link>
          </h1>
        </div>
        <div className="Dashboard">
          <h1>
            <Link to="/Admin/Orders">Orders {Orders}</Link>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;



// import { Link } from 'react-router-dom';

// function DashBoard({ Review, productsItem, category, Users }) {
//   return (
//     <div className="dashboard-container flex-1 p-3">
//       <div className="dashboard-grid">
//         <div className="Dashboard"><h1><Link to="/Admin/UserDetails">Users {Users?.length}</Link></h1></div>
//         <div className="Dashboard"><h1><Link to="/Admin/Products">Products {productsItem?.length}</Link></h1></div>
//         <div className="Dashboard"><h1><Link to="/Admin/Reviews">Reviews {Review?.length}</Link></h1></div>
//         <div className="Dashboard"><h1><Link to="/Admin/Categorys">Categorys {category?.length}</Link></h1></div>
//       </div>
//     </div>
//   );
// }

// export default DashBoard;

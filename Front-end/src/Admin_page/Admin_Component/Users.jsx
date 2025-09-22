import { useOutletContext } from "react-router-dom";
import "../assets_Admin/AdminPages.css";
import ApiService from "../../components/Service/ApiService/product-api";

function Users() {
  const users = useOutletContext();

  return (
    <div className="Admin_page p-3">
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover align-middle text-center">
          <thead className="table-success">
            <tr>
              <th>UserId</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th>Phone Number</th>
              <th>Profile Image</th>
              <th>Profile View</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td className="text-truncate" style={{ maxWidth: "150px" }}>
                  {user.password}
                </td>
                <td>{user.phoneNumber}</td>
                <td>{user?.profileImage}</td>
                {user?.profileImage&&<td><a href={ApiService.Backend+user?.profileImage} className=" bg-info p-3 rounded-2">View</a></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;

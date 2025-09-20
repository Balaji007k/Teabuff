import { useOutletContext } from "react-router-dom";
import "../assets_Admin/AdminPages.css";

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;

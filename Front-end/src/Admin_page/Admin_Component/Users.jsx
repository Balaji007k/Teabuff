import { useOutletContext } from "react-router-dom";
import "../assets_Admin/AdminPages.css";
import ApiService from "../../components/Service/ApiService/product-api";

function Users() {
  const {Users} = useOutletContext();
  console.log(Users)

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
            {Users.map((User) => (
              <tr key={User._id}>
                <td>{User._id}</td>
                <td>{User.username}</td>
                <td>{User.email}</td>
                <td className="text-truncate" style={{ maxWidth: "150px" }}>
                  {User.password}
                </td>
                <td>{User.phoneNumber}</td>
                <td>{User?.profileImage}</td>
                {User?.profileImage&&<td><a href={ApiService.Backend+User?.profileImage} className=" bg-info p-3 rounded-2">View</a></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;

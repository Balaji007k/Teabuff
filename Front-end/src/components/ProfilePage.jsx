import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiService from "./Service/ApiService/product-api";

export default function ProfilePage({ isAuthenticated }) {
  const [User, setUser] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [contact, setcontact] = useState(null);
  const [preview, setPreview] = useState('assets/ProfileImage.svg');

  const Backend = `/users/update/${isAuthenticated.userId}`;

  const fetchUserProfile = async () => {
    const { Result, Error } = await ApiService.fetchData(`/user/${isAuthenticated.userId}`);
    if (Result?.user) {
      setUser(Result.user);
      setPreview(`${ApiService.Backend+Result.user?.profileImage}`);
      setcontact(Result.user?.phoneNumber || "");

      const username = (Result.user.username || "").trim();
      const parts = username.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts[1] || "");
      setAddress(Result.user.address || "");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

   const fileInputRef = useRef(null);
  
    const handleIconClick = () => {
      fileInputRef.current.click(); // open file dialog
    };

  // 👉 Handle Form Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("username", `${firstName} ${lastName}`.trim());
//       formData.append("address", address);
//       formData.append("oldPassword", oldPassword);
//       formData.append("newPassword", newPassword);
//       formData.append("phoneNumber", contact);

//       console.log(formData)

//       const { Result, Error } = await ApiService.fetchData(Backend, "PUT", formData);

//       if (Result) {
//         alert("Profile updated successfully ✅");
//         window.location.reload();
//       } else {
//         alert(Error || "Something went wrong ❌");
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       alert("Server error ❌");
//     }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      username: `${firstName} ${lastName}`.trim(),
      address,
      oldPassword,
      newPassword,
      phoneNumber: contact,
    };

    console.log(payload)

    const { Result, Error } = await ApiService.fetchData(Backend, "PUT", payload);

    if (Result) {
      alert("Profile updated successfully ✅");
      window.location.reload();
    } else {
      alert(Error || "Something went wrong ❌");
    }
  } catch (err) {
    console.error("Update error:", err);
    alert("Server error ❌");
  }
};


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
  
      // Upload to backend
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("userId", isAuthenticated?.userId); // pass userId
  
      try {
          const { Result, Error } = await ApiService.fetchData(`/api/users/${isAuthenticated.userId}`,"PUT",formData);
        if (Result?.profileImage) {
          // backend URL replaces temporary preview
          setPreview(`${ApiService.Backend+Result?.profileImage}`);
        } else {
          console.error("Upload failed:", Error);
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
  };

  return (
    <div className="container mb-3" style={{ marginTop: "75px" }}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* Profile Header */}
              <div className="d-flex flex-column align-items-center mb-4">
                <div className="position-relative">
                  <img src={preview} alt="Profile" height={'150px'} width={'150px'} className=" rounded-circle bg-black" 
                                onClick={()=>{Navigate(`/Profile/${isAuthenticated?.userId}`)}}
                                onError={(e) => {
    e.currentTarget.onerror = null; // avoid infinite loop
    e.currentTarget.src = "assets/ProfileImage.svg"; // fallback if image not found
  }} />
                  <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
                  <label
                    onClick={handleIconClick}
                    className="btn btn-sm btn-light border position-absolute"
                    style={{ bottom: 0, right: 0, cursor: "pointer" }}
                  >
                    ✏️
                  </label>
                </div>
                <h4 className="mt-3 mb-0">{User?.username}</h4>
              </div>

              {/* Tabs */}
              <ul className="nav nav-pills justify-content-center mb-4">
                <li className="nav-item">
                  <button className="nav-link active">Profile</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link">Testing</button>
                </li>
              </ul>

              {/* Profile Form */}
              <form
                className=" d-sm-flex flex-sm-column gap-sm-4"
                onSubmit={handleSubmit}
              >
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={User?.email || ""}
                    className="form-control border-danger"
                    disabled
                  />
                </div>

                {/* Full Name */}
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-control"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-control"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {/* Shipping */}
                <div className="mb-3">
                  <label className="form-label">Shipping Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    placeholder="Enter your address"
                  />
                </div>

                {/* Old Password */}
                <div className="mb-3">
                  <label className="form-label">Old Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="form-control"
                    placeholder="****************"
                  />
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-control"
                    placeholder="****************"
                  />
                </div>

                {/* Contact */}
                <div className="mb-3">
                  <label className="form-label">Contact</label>
                  <input
                    type="tel"
                    value={contact || ""}
                    onChange={(e) => setcontact(e.target.value)}
                    className="form-control"
                    placeholder="eg: 1234567890"
                  />
                </div>

                {/* Save Button */}
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

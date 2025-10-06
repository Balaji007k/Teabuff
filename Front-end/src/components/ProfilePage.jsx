import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiService from "./Service/ApiService/product-api";
import AlertMessage from './AssetComponents/AlertMessage';
import "../style/ProfilePage.css"
import { useTheme } from "../ThemeContext";

export default function ProfilePage({ isAuthenticated }) {
  const [User, setUser] = useState(null);

  const {Theme} = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [contact, setcontact] = useState(null);
  const [preview, setPreview] = useState('assets/ProfileImage.svg');
  const [AlertMessageProfile,setAlertMessage] = useState(null);

  // add states
const [isEditingPassword, setIsEditingPassword] = useState(false);
//tset


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
    window.scrollTo(0,0);
  }, []);

   const fileInputRef = useRef(null);
  
    const handleIconClick = () => {
      fileInputRef.current.click(); // open file dialog
    };


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

    //console.log(payload)

    const { Result, Error } = await ApiService.fetchData(Backend, "PUT", payload);

    if (Result) {
      setAlertMessage({message:"Profile updated successfully",state:true})
    } else {
      setAlertMessage({message:Error || `Something went wrong`,state:false})
    }
  } catch (err) {
    console.error("Update error:", err);
    setAlertMessage({message:"Server error",state:false})
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

  useEffect(()=>{
    if(AlertMessageProfile&&AlertMessageProfile?.message){
      setTimeout(()=>{
        setAlertMessage(null);
        if(AlertMessageProfile&&AlertMessageProfile?.state){window.location.reload()};
      },1500)
    }
  },[AlertMessageProfile])

  return (
    <>
    {AlertMessageProfile&&AlertMessageProfile?.message&&<AlertMessage message={AlertMessageProfile}/>}
    <div className="Profile-page-main-container container-md mb-md-4" style={{ marginTop: "75px" }}>
      <div className={`row justify-content-center`}>
        <div className="col-md-8 col-lg-6">
          <div className={`card ${Theme?'text-white':'text-black'}`}>
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
                  <i className="fa-solid fa-pen-to-square p-2 fs-4 position-absolute"
                  onClick={handleIconClick}
                    style={{ bottom: 0, right: 0, cursor: "pointer",color:'burlywood' }}></i>
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
                className=" d-sm-flex flex-sm-column gap-sm-4 align-items-center"
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
                <div className="d-flex gap-3 mb-3">
                  <div className="w-50">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-control"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="w-50">
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
                {/* <div className="mb-3">
                  <label className="form-label">Old Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="form-control"
                    placeholder="****************"
                  />
                </div> */}

                {/* New Password */}
                {/* <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-control"
                    placeholder="****************"
                  />
                </div> */}

                <div className="mb-3 position-relative">
  <label className="form-label">Old Password</label>
  <input
    type="password"
    value={oldPassword}
    onChange={(e) => setOldPassword(e.target.value)}
    className="form-control"
    placeholder="****************"
    disabled={!isEditingPassword}
  />
</div>

<div className="mb-3 position-relative">
  <label className="form-label">New Password</label>
  <input
    type="password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="form-control"
    placeholder="****************"
    disabled={!isEditingPassword}
  />
  {/* <button
    type="button"
    onClick={() => setIsEditingPassword(!isEditingPassword)}
    className="btn btn-sm btn-outline-secondary position-absolute"
    style={{ top: "50%", right: "10px" }}
  >
    ✏️
  </button> */}
  <i class="fa-solid fa-pencil text-black position-absolute p-2 border border-1 border-dark-subtle rounded-2" style={{ top: "48%", right: "10px", cursor:'pointer'}}
  onClick={() => setIsEditingPassword(!isEditingPassword)}></i>
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
    </>
  );
}

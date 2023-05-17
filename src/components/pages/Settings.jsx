import React from "react";
import './Home.css';
import { auth } from "../../config/firebase";
import { updatePassword   } from "firebase/auth";
import { getDatabase, ref, child, set } from "firebase/database";

export const Settings = () => {

  const user = auth.currentUser;
  const uid = user.uid
  const dbRef = ref(getDatabase());

  const handleChangePassword = async (e) => {
    const data = {
      email: e.target.currentPassword.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    }

    if(data.password === data.confirmPassword){
      const newPassword = data.password; 
    }

  }

  const deleteAccount = (e) => {

  }

  return (
    <div className="mainContainer">
      <div className="page-container-topic-bar d-flex justify-content-center align-items-center">
        <h1>Account Settings</h1>
        <img src="setting.png" alt="" />
      </div>
      <div className="container changepasswordcontainer d-flex justify-content-center align-items-center flex-column">
        <h4 className="text-secondary mt-4">Change your password</h4>
        <form onSubmit={handleChangePassword}>
          <div className="mt-5">
            <label>Current Password</label>
            <input type="password" name="currentPassword" id="currentPassword" placeholder="Enter your current password" className="p-2 w-100" required />
          </div>

          <div className="mt-5">
            <label>New Password</label>
            <input type="password" name="password" id="password" placeholder="Enter your new password" className="p-2 w-100" required />
          </div>
          <div className="mt-2">
            <label>Confirm New Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Re-enter your new password" className="p-2 w-100" required />
          </div>

          <button className="btn btn-success w-100 mt-3">Change Password</button>

          <p className="text-center m-2 text-secondary">Enter your current password and then enter the password that you wich to change for.</p>
        </form>
      </div>

      <div className="container changepasswordcontainer d-flex justify-content-center align-items-center flex-column">
        <h4 className="text-secondary mt-4">Delete Your Account</h4>
        <button className="btn btn-danger w-100" onClick={deleteAccount}>Delete Your Account Permanently</button>
      </div>

    </div>
  );
};

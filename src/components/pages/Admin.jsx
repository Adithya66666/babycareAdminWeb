import React, { useState,useEffect } from "react";
import './Home.css';
import { getDatabase, ref, child, get, set, push,remove } from "firebase/database";
export const Admin = () => {

  const currentUserId = sessionStorage.getItem('userkey');

  const [addAdmin,setAddAdmin] = useState(false);

  const userType = sessionStorage.getItem("usertype");
  const [isEmailUsed,setIsEmailused] = useState(false);
  const dbRef = ref(getDatabase());


  const [adminList,setAdminList] = useState([]);
  const [adminIdList,setAdminIdList] = useState([]); 


  const [clickedDelete,setClickedDelete] = useState("null"); 


  const loadAdmins = async () => {
    const array = [];
    const arrayId = [];
    const snapshot = await get(child(dbRef, `Admin`));
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        array.push({
          fname:childSnapshot.child("firstName").val(),
          lname:childSnapshot.child("lastName").val(),
          email:childSnapshot.child("email").val(),
          username:childSnapshot.child("username").val(),
          usertype:childSnapshot.child("usertype").val(),
          lastTime:childSnapshot.child("lastLoginTime").val(),
          lastDate:childSnapshot.child("lastLoginDate").val()
        });

        arrayId.push(childSnapshot.key)
      });
      setAdminList(array);
      setAdminIdList(arrayId);
    } else {
      console.log("No data available");
    }
  };
  
  useEffect(() => {
    loadAdmins();
  }, []);


  const deleteAdmin = async (key) => {
    setClickedDelete(adminIdList[key]);
  }

  const confirmDelete = async (e) => {
    const adminId = clickedDelete
    await remove(child(dbRef, `Admin/${adminId}`))
      .then(() => {
        setClickedDelete("null");
        loadAdmins();
        alert("Admin deleted successfully!");
      })
      .catch((error) => {
        alert("Failed to delete the admin!");
      });
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
      cpassword: e.target.cpassword.value,
      firstName: e.target.fname.value,
      lastName: e.target.lname.value,
      usertype: e.target.type.value,
      username: e.target.username.value,
    }

    const fdata = {
      email: e.target.email.value,
      password: e.target.password.value,
      firstName: e.target.fname.value,
      lastName: e.target.lname.value,
      usertype: e.target.type.value,
      username: e.target.username.value,
      lastLoginDate: "N/A",
      lastLoginTime: "N/A",
    }

    if(data.usertype !== "none"){
      if(data.password === data.cpassword){
        await get(child(dbRef, `Admin`)).then((snapshot) => {
          if (snapshot.exists()) {

            snapshot.forEach((childSnapshot) => {
              const userData = childSnapshot.val();
              if (userData.email === data.email) {
                setIsEmailused(true);
              }
            })

          } else {

          }
    
        }).catch((error) => {

        });

        if(isEmailUsed){
          alert("This email is already used.");
          setIsEmailused(false);
        }else{
          const adminRef = child(dbRef, 'Admin');
          const newId = push(adminRef).key;
          const newUserRef = child(adminRef, newId);
          set(newUserRef, fdata)
          .then(() => {
            setIsEmailused(false);
            alert("Admin Created successfully!");
            setAddAdmin(false);
            loadAdmins()
          })
          .catch((error) => {});
        }

      }else{
        alert("Passwords are not matched");
      }
    }else{
      alert("Select the usertype");
    }

  }

  return (
    <>
      <div className="mainContainer" onLoad={loadAdmins}>
        { !addAdmin && clickedDelete === "null" && <>

          <div className="page-container-topic-bar d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-center align-items-center">
              <h1>Admin</h1>
              <img src="admin.png" alt="" />
            </div>
            { userType === "Main" && <>
              <button className="btn btn-success" onClick={() => setAddAdmin(true)}>Add New Admin</button>
            </>}
          </div>

          <div className="container p-3 border mt-3">
            <table className="w-100">
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Usertype</th>
                <th>Email</th>
                <th>Last Login Date</th>
                <th>Last Login Time</th>
                <th>Delete</th>
              </tr>
              {adminList.map((data, index) => (
                <>
                <tr key={index}>
                  <td>{ data.fname +" "+ data.lname }</td>
                  <td>{ data.username }</td>
                  <td>{ data.usertype }</td>
                  <td>{ data.email }</td>
                  <td>{ data.lastDate }</td>
                  <td>{ data.lastTime }</td>
                  { currentUserId !== adminIdList[index] && <>
                    <td><button className="btn btn-danger" onClick={() => deleteAdmin(index)}>Delete</button></td>
                  </>}
                  { currentUserId === adminIdList[index] && <>
                    <td>you</td>
                  </>}
                </tr>
                </>
              
              ))}
            </table>
          </div>

        </>
        }


        { addAdmin && clickedDelete === "null" && <>
        
        <div className="page-container-topic-bar d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-center align-items-center">
            <h1>Add New Admin</h1>
            <img src="admin.png" alt="" />
          </div>
          <button className="btn btn-success" onClick={() => setAddAdmin(false)}>Back</button>
        </div>


        <div className="container w-50 p-3 mt-3">
          <form onSubmit={handleRegister}>
            <label className="mt-2">First Name</label>
            <input type="text" name="fname" id="fname" placeholder="Enter the admin's first name" required className="w-100 p-2" />

            <label className="mt-2">Last Name</label>
            <input type="text" name="lname" id="lname" placeholder="Enter the admin's last name" required className="w-100 p-2" />

            <label className="mt-2">Email</label>
            <input type="text" name="email" id="email" placeholder="Enter the admin's Email" required className="w-100 p-2" />

            <label className="mt-2">Username</label>
            <input type="text" name="username" id="username" placeholder="Enter the admin's username" required className="w-100 p-2" />

            <label className="mt-2">Password</label>
            <input type="text" name="password" id="password" placeholder="Enter a password" required className="w-100 p-2" />

            <label className="mt-2">Confirm Password</label>
            <input type="text" name="cpassword" id="cpassword" placeholder="Confirm the password" required className="w-100 p-2" />

            <label className="mt-2">User type</label>
            <select name="type" id="type" className="w-100 p-2">
              <option value="none" hidden>Select the Admin type</option>
              <option value="Admin">Admin</option>
              <option value="Main">Main Admin</option>
            </select>

            <button className="mt-3 btn btn-primary w-100">Create Admin</button>


          </form>
        </div>


        </>
        }


        { clickedDelete !== "null"  && <>
        
        <div className="container">
          <p>By clicking "Delete the admin permanently" selected admin will be deleted permanently and data cannot be recovered.</p>
          <button className="btn btn-danger mt-3" onClick={confirmDelete}>Delete the admin permanently</button> <br />
          <button className="btn btn-success mt-1" onClick={() => setClickedDelete("null")}>Cencel</button>
        </div>

        </>}


      </div>
    </>
  );
};

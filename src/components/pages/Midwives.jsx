import React from "react";
import { useState } from "react";
import { getDatabase, ref, child, get, set, push,remove } from "firebase/database";
import './Home.css';

export const Midwives = () => {

  const [addMidwife,setAddMidwife] = useState(false);

  const [isEmailUsed,setIsEmailused] = useState(false);

  const [midwivesList,setMidwivesList] = useState([]);
  const [midwivesIdList,setMidwivesIdList] = useState([]); 

  const [clickedDelete,setClickedDelete] = useState("null"); 

  const dbRef = ref(getDatabase());

  const loadMidwives = async (e) => {
    const array = [];
    const arrayId = [];
    const snapshot = await get(child(dbRef, `User`));
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        array.push({
          fname:childSnapshot.child("firstName").val(),
          lname:childSnapshot.child("lastName").val(),
          email:childSnapshot.child("email").val(),
          username:childSnapshot.child("username").val()
        });

        arrayId.push(childSnapshot.key)
      });
      setMidwivesList(array);
      setMidwivesIdList(arrayId);
    } else {
      console.log("No data available");
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
      cpassword: e.target.cpassword.value,
      firstName: e.target.fname.value,
      lastName: e.target.lname.value,
      username: e.target.username.value,
    }

    const fdata = {
      email: e.target.email.value,
      password: e.target.password.value,
      firstName: e.target.fname.value,
      lastName: e.target.lname.value,
      username: e.target.username.value,
      type: "mid",
    }

    if(data.password === data.cpassword){
      await get(child(dbRef, `User`)).then((snapshot) => {
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
        const adminRef = child(dbRef, 'User');
        const newId = push(adminRef).key;
        const newUserRef = child(adminRef, newId);
        set(newUserRef, fdata)
        .then(() => {
          setIsEmailused(false);
          alert("Midwife account Created successfully!");
          setAddMidwife(false);
          loadMidwives()
        })
        .catch((error) => {});
      }
    }else{
      alert("Passwords are not matched");
    }
  }

  const deleteMidwife = (key) => {
    setClickedDelete(midwivesIdList[key]);
  }

  const confirmDelete = async (e) => {
    const midwifeId = clickedDelete
    await remove(child(dbRef, `User/${midwifeId}`))
      .then(() => {
        setClickedDelete("null");
        loadMidwives();
        alert("midwife deleted successfully!");
      })
      .catch((error) => {
        alert("Failed to delete the midwife!");
      });
  }

  return (

    <>
    <div className="mainContainer" onLoad={loadMidwives}>
    { !addMidwife && clickedDelete === "null" && <>

      <div className="page-container-topic-bar d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-center align-items-center">
          <h1>Midwives</h1>
          <img src="nurse.png" alt="" />
        </div>
        <button className="btn btn-success" onClick={() => setAddMidwife(true)}>Add New Midwife</button>
      </div>

      <div className="container p-3 border mt-3">
            <table className="w-100">
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Delete</th>
              </tr>
              {midwivesList.map((data, index) => (
                <>
                <tr key={index}>
                  <td>{ data.fname +" "+ data.lname }</td>
                  <td>{ data.username }</td>
                  <td>{ data.email }</td>
                  <td><button className="btn btn-danger" onClick={() => deleteMidwife(index)}>Delete</button></td>
                </tr>
                </>
              
              ))}
            </table>
          </div>

      </>
    }


    { addMidwife && clickedDelete === "null" && <>

      <div className="page-container-topic-bar d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-center align-items-center">
          <h1>Add New Midwife</h1>
          <img src="nurse.png" alt="" />
        </div>
        <button className="btn btn-success" onClick={() => setAddMidwife(false)}>Back</button>
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

            <button className="mt-3 btn btn-primary w-100">Create Admin</button>

          </form>
        </div>

    </>
    }
    
    { clickedDelete !== "null"  && <>
        
        <div className="container">
          <p>By clicking "Delete the midwife account permanently" selected midwife will be deleted permanently and data cannot be recovered.</p>
          <button className="btn btn-danger mt-3" onClick={confirmDelete}>Delete the midwife account permanently</button> <br />
          <button className="btn btn-success mt-1" onClick={() => setClickedDelete("null")}>Cencel</button>
        </div>

        </>}

    </div>
    </>
  );
};

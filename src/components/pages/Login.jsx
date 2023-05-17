import React, { useState,useEffect } from "react";
import './Home.css';

import { signInWithEmailAndPassword, signOut,createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { getDatabase, ref, child, get, set,remove } from "firebase/database";

export const Login = () => {

  const [loginStart,setLoginStart] = useState(false)
  const [isUserLogged,setIsUserLogged] = useState(false)
  const [isUserCreated,setIsUserCreated] = useState(false)
  const [tempAdminId,setTempAdminId] = useState("")
  
  const dbRef = ref(getDatabase());

  const [tempData,setTempData] = useState({
    email:"",
    firstName:"",
    lastName:"",
    password:"",
    username:"",
    usertype:"",
    lastLoginDate:"",
    lastLoginTime:"",
  })

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginStart(true);

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    }
    try{
      await signInWithEmailAndPassword(auth,data.email,data.password);
      console.log("user logged in")
      setIsUserLogged(true);
    }catch(err){
      setIsUserLogged(false);
      if(err.code === "auth/user-not-found"){
        const snapshot = await get(child(dbRef, `Admin`));
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            if(childSnapshot.child("email").val() === data.email && childSnapshot.child("password").val() === data.password){

              setTempData({
                email:childSnapshot.child("email").val(),
                firstName:childSnapshot.child("firstName").val(),
                lastName:childSnapshot.child("lastName").val(),
                password:childSnapshot.child("password").val(),
                username:childSnapshot.child("username").val(),
                usertype:childSnapshot.child("usertype").val(),
                lastLoginDate:childSnapshot.child("lastLoginDate").val(),
                lastLoginTime:childSnapshot.child("lastLoginTime").val(),
              })

              setTempAdminId(childSnapshot.key);
              

              createUserWithEmailAndPassword(auth, data.email, data.password)
              .then((userCredential) => {
                // User created successfully
                setIsUserLogged(true);
                setIsUserCreated(true);
              })
              .catch((error) => {
                // Handle errors here
                const errorCode = error.code;
                alert("Failed to login");
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
              });

            }
          });
        } else {
          console.log("No data available");
        }
      }else{
        alert(err.code);
      }
    }
  }

  const [isDelete,setIsDelete] = useState(false)

  useEffect(() => {
    if (isUserCreated) {
      setIsUserCreated(false);
      const adminRef = child(dbRef, 'Admin');
          const newId = auth.currentUser.uid;
          const newUserRef = child(adminRef, newId);
          set(newUserRef, tempData)
          .then(() => {
            setIsDelete(true);
          })
          .catch((error) => {
            setIsDelete(false);
          });
    }
  }, [dbRef, isUserCreated, tempAdminId, tempData]);

  useEffect(() => {
    if (isDelete) {
      setIsDelete(false);
      remove(child(dbRef, `Admin/${tempAdminId}`))
      .then(() => {})
      .catch((error) => {
      });
    }
  }, [dbRef, isDelete, tempAdminId]);

  useEffect(() => {
    if (isUserLogged) {
      const userid = auth.currentUser.uid

      get(child(dbRef, `Admin/${userid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          //login success
          sessionStorage.setItem('userkey',userid);
          sessionStorage.setItem('usertype',snapshot.child("usertype").val());

          const dateRef = child(dbRef, `Admin/${userid}/lastLoginDate`);
          const timeRef = child(dbRef, `Admin/${userid}/lastLoginTime`);

          const date = new Date().toLocaleDateString();
          const time = new Date().toLocaleTimeString();

          set(dateRef, date)
          .then(() => {})
          .catch((error) => {});

          set(timeRef, time)
          .then(() => {})
          .catch((error) => {});

          window.location.replace("/");
        } else {
          //login failed user is not the selected type
          signOut(auth)
          setLoginStart(false);
          alert("Entered Email and password was wrong");
        }

      }).catch((error) => {
        setLoginStart(false);
      });
    }
  }, [dbRef, isUserLogged]);



  return (
    <div className="mainContainer">

      <div className="container w-50">
        { !loginStart && <>
        
        <h1>Login</h1>
        <div className="container">
          <form onSubmit={handleLogin}>
            <div>
              <label className="w-100 p-2">Email</label>
              <input className="w-100 p-2" type="email" id="email" name="email" placeholder="Enter your email address" required />
            </div>
            <div>
              <label className="w-100 p-2">Password</label>
              <input className="w-100 p-2" type="password" id="password" name="password" placeholder="Enter your email address" required   />
            </div>
            <div>
              <button type="submit" className="btn btn-primary block w-100 mt-4 mb-3">Login</button>
            </div>
          </form>
        </div>
        
        </>}


        { loginStart && <>
        
        <h1>Loading...</h1>

        </>}
      </div>

    </div>
  );
};

import React from "react";
import './Home.css';
import { Link } from "react-router-dom";

export const Home = () => {

  const userKey = sessionStorage.getItem('userkey');
  const usertype = sessionStorage.getItem('usertype');

  var userLoggedInStatus = false;
  if(userKey !== null && usertype !== null){
    userLoggedInStatus = true;
  }

  const login = (e) => {

  }

  return (
    <div className="mainContainer">
      <div className="container d-flex justify-content-center align-items-center flex-column">
        <img className="homeLogo" src="hospital.png" alt="" />
        <h5>Welcome!</h5>
        <h1>Babycare Admin Dashboard</h1>
      </div>

      { !userLoggedInStatus && <>

      <div className="container d-flex justify-content-center align-items-center flex-column mt-5">
        <h4>Login to your admin account to use the Babycare admin dashboard.</h4>
        <Link to="/login" className="w-100 d-flex justify-content-center align-items-center"><button className="btn btn-primary w-25 m-3" onClick={login}>Login</button></Link>
      </div>
      
      </> }
 
    </div>
  );
};

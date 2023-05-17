import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
//import { signOut } from "firebase/auth";


function NavBar({isLoggedIn,usertype}) {
    const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const isUserLoggedIn = isLoggedIn;

  const logout = () => {
    sessionStorage.clear();
    signOut(auth);
    window.location.replace("Login");
  }

  return (
    <>
    <nav class="navbar navbar-expand-lg navbar-light bg-light p-2 border-bottom border-primary">
      <div className="navbar-brand">
        <NavLink exact to="/" className="mainbrandName text-decoration-none text-dark d-flex justify-content-center align-items-center">
          <img src="hospital.png" alt="" />
          <div className="topBrandBrandName">
            <h2>Babycare</h2>
            <h6>Admin Dashboard</h6>
          </div>
        </NavLink>
      </div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-link"
                onClick={handleClick}
              >
                Home
              </NavLink>
          </li>

          { !isUserLoggedIn &&  
            
            <li className="nav-item">
              <NavLink
                exact
                to="/login"
                activeClassName="active"
                className="nav-link"
                onClick={handleClick}
              >
                Log In
              </NavLink>
            </li>
            
            }

            { isUserLoggedIn && usertype === "Main" &&      
              <li className="nav-item">
                <NavLink
                  exact
                  to="/admin"
                  activeClassName="active"
                  className="nav-link"
                  onClick={handleClick}
                >
                  Admin
                </NavLink>
              </li>
            }

            { isUserLoggedIn &&       
              <li className="nav-item">
                <NavLink
                  exact
                  to="/midwives"
                  activeClassName="active"
                  className="nav-link"
                  onClick={handleClick}
                >
                  Midwives
                </NavLink>
              </li>
            }
            


            { isUserLoggedIn &&       
              <li className="nav-item">
                <NavLink
                  exact
                  to="/settings"
                  activeClassName="active"
                  className="nav-link"
                  onClick={handleClick}
                >
                  Settings
                </NavLink>
              </li>
            }
            

            { isUserLoggedIn &&       
              <li className="nav-item">
                <NavLink
                  exact
                  to="/login" 
                  activeClassName="active"
                  className="nav-link"
                  onClick={logout}
                >
                  Log out
                </NavLink>
              </li>
            }

        </ul>
      </div>
    </nav>
    </>
  );
}

export default NavBar;
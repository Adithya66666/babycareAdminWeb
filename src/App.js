import './App.css';

import NavBar from './components/NavBar';
import { Footer } from './components/Footer';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";

import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import { Settings } from './components/pages/Settings';
import { Admin } from './components/pages/Admin';
import { Midwives } from './components/pages/Midwives';

function App() {
  const userKey = sessionStorage.getItem('userkey');
  const usertype = sessionStorage.getItem('usertype');

  var userLoggedInStatus = false;
  if(userKey !== null && usertype !== null){
    userLoggedInStatus = true;
  }
  return (
    <>
      <Router>
      <NavBar 
        isLoggedIn={userLoggedInStatus}
        usertype={usertype}
        />
          <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/midwives" element={<Midwives/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </Router>
      <Footer/>
    </>
  );
}

export default App;

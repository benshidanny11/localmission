import React from 'react';
import '../assets/css/restrictedAccess.css'
import { useNavigate } from 'react-router-dom';

const RestrictedAccess = () => {
  const Navigate = useNavigate();
  return (
    <div className="container">
      <div className="number">
        <span className="digit">4</span>
        {/* <img
          className="lock-icon"
          src="Assets/lock-up.png"
          alt="Lock"
        /> */}

        <span className="digit">0</span>
        <span className="digit">3</span>
      </div>
      <div className="message">
        <h2>Restricted Access</h2>
        <p>You lack permissions to access this page</p>
        <button className="button" onClick={()=>Navigate("/")}>Go Home</button>
      </div>
    </div>
  );
};

export default RestrictedAccess;

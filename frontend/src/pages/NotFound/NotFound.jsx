import React from "react";
import "./notfound.css";
import {Link} from "react-router-dom"

const NotFound = () => {
  return (
    <div className="notfound-container">
      <img src={"/notfound2.png"} alt="Not Found" className="notfound-image" />
      <h1 className="notfound-title">404 - Page Not Found</h1>
      <p className="notfound-text">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="home-link">Go back to Home</Link>
    </div>
  );
};

export default NotFound;


import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ email, logoutClick }) => {
  if (email) {
    return (
      <nav>
        <Link to="/">Home</Link> |
        <Link to="/cabinet">{email}</Link> |
        <button onClick={logoutClick}>Logout</button>
      </nav>
    );
  }

  return (
    <nav>
      <Link to="/">Home</Link> |
      <Link to="/login">Login</Link> |
      <Link to="/signup">Sign Up</Link>
    </nav>
  );
};


const Menu = (props) => {
  return (
    <div>
      "URL Shortener"
      <NavBar {...props} />
    </div>
  );
};


export default Menu;

import React from "react";
import { connect } from "react-redux";

import { logoutUser } from "./actions/userActions/logoutAction";
import { NavBar } from "./NavBar";


const Menu = (props) => {
  const { email, logoutHandler } = props;

  return (
    <NavBar email={email} logoutHandler={logoutHandler} />
  );
};


const mapStateToProps = (state) => {
  return {
    email: state.userReducer.email,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    logoutHandler: () => {
      dispatch(logoutUser());
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);

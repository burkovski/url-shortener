import { connect } from "react-redux";
import { createUser } from "../actions/saga/userActions/signupSaga";

import SignUp from "../components/SignUp";

const mapDispatchToProps = (dispatch) => {
  return {
    signUpClick: (email, password) => {
      dispatch(createUser(email, password));
    }
  };
};


export default connect(
  null,
  mapDispatchToProps
)(SignUp);

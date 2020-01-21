// import { loginUser } from "../actions/thunk/userActions/loginAction";
import { connect } from "react-redux";

import { loginUser } from "../actions/saga/userActions/loginSaga";
import Login from "../components/Login";

const mapDispatchToProps = (dispatch) => {
  return {
    loginClick: (login, password) => {
      dispatch(loginUser(login, password));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Login);

import { connect } from "react-redux";

import Menu from "../components/Menu";
import { logoutUser } from "../actions/saga/userActions/logoutSaga";


const mapStateToProps = (state) => {
  return {
    email: state.userReducer.email,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    logoutClick: () => {
      dispatch(logoutUser());
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);

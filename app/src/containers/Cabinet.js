// import { fetchUrls } from "../actions/thunk/urlActions/fetchAction";
import { fetchUrls } from "../actions/saga/urlsActions/fetchSaga";
import { connect } from "react-redux";

import Cabinet from "../components/Cabinet";


const mapStateToProps = (state) => {
  return {
    urlsList: state.urlReducer.urls,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    refreshClick: () => {
      dispatch(fetchUrls());
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cabinet);
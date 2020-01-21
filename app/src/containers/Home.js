import { connect } from "react-redux";

import Home from "../components/Home";
import { shortifyUrl } from "../actions/saga/urlsActions/shortifySaga";


const mapStateToProps = (state) => {
  const { shortUrl } = state.urlReducer;
  return { shortUrl };
};


const mapDispatchToProps = (dispatch) => {
  return {
    onShortifyClick: (url, ttl) => {
      url = url.trim();
      if (url) {
        dispatch(shortifyUrl(url, ttl));
      }
    }
  };
};


export  default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);


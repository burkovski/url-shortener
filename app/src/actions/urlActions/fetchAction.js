import {
  FETCH_USER_OWNED_URLS_FAILURE,
  FETCH_USER_OWNED_URLS_REQUEST,
  FETCH_USER_OWNED_URLS_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS
} from "../actions";
import {push} from "connected-react-router";
import {myFetch, shouldRefreshTokens, ROOT_URL} from "../../utils";


const loginUserRequest = () => {
  return { type: LOGIN_USER_REQUEST };
};


const loginUserFailure = (error) => {
  return {
    type: LOGIN_USER_FAILURE,
    error
  };
};


const loginUserSuccess = (tokens, email) => {
  const payload = JSON.parse(atob(tokens["token"].split('.')[1]));
  const userId = payload["user_id"];
  return {
    type: LOGIN_USER_SUCCESS,
    tokens,
    email,
    userId
  };
};


const fetchUrlsRequest = () => {
  return { type: FETCH_USER_OWNED_URLS_REQUEST };
};


const fetchUrlsFailure = (error) => {
  return {
    type: FETCH_USER_OWNED_URLS_FAILURE,
    error
  };
};


const fetchUrlsSuccess = (data) => {
  return {
    type: FETCH_USER_OWNED_URLS_SUCCESS,
    data
  };
};


const shouldFetch = (store) => {
  if (store.inProcessing) {
    return false;
  }

  if (!store.urls.length) {
    return true;
  }

  return store.didInvalidate;
};


export const fetchUrls = () => {
  return (dispatch, getState) => {
    const { userReducer, urlReducer } = getState();
    const { email, accessToken, refreshToken } = userReducer;

    if (!email || !accessToken || !refreshToken) {
      dispatch(push("/login"));
      return;
    }

    if (!shouldFetch(urlReducer)) {
      return;
    }

    if (shouldRefreshTokens(accessToken)) {
      dispatch(loginUserRequest());
      myFetch(`${ROOT_URL}/api/auth/tokens`, "PUT", {"refresh_token": refreshToken})
        .then((response) => {
          if (!response.isSuccess) {
            throw response.error;
          }
          return response.data;
        })
        .then((data) => {
          dispatch(loginUserSuccess(data["created"], email));
        })
        .catch((error) => {
          dispatch(loginUserFailure(error));
        });

      return;
    }

    dispatch(fetchUrlsRequest());
    myFetch(`${ROOT_URL}/urls/owned`, "GET", null, { "Authorization": `Bearer ${accessToken}` })
      .then((response) => {
        if (!response.isSuccess) {
          throw response.error;
        }
        return response.data;
      })
      .then((data) => {
        dispatch(fetchUrlsSuccess(data));
      })
      .catch((error) => {
        dispatch(fetchUrlsFailure(error));
      });
  }
};
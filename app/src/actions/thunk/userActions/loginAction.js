import {
  LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS,
  REFRESH_TOKENS_SUCCESS, REFRESH_TOKENS_FAILURE, REFRESH_TOKENS_REQUEST
} from "../../actionTypes";
import { fetchUrls } from "../urlActions/fetchAction";
import { myFetch, ROOT_URL } from "../../../utils";
import { push } from "connected-react-router";
import {createDispatchHook} from "react-redux";


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
  return {
    type: LOGIN_USER_SUCCESS,
    tokens,
    email,
  };
};


const refreshTokensRequest = () => {
  return {
    type: REFRESH_TOKENS_REQUEST
  };
};


const refreshTokensSuccess = (tokens) => {
  return {
    type: REFRESH_TOKENS_SUCCESS,
    tokens
  };
};


const refreshTokensFailure = (error) => {
  return {
    type: REFRESH_TOKENS_FAILURE,
    error
  };
};


export const loginUser = (email, password) => {
  return (dispatch) => {
    dispatch(loginUserRequest());

    myFetch(`${ROOT_URL}/auth/tokens`, "POST", {email, password})
      .then((response) => {
        if (!response.isSuccess) {
          throw response.error;
        }
        return response.data;
      })
      .then((data) => {
        dispatch(loginUserSuccess(data["created"], email));
        dispatch(push('/'));
        dispatch(fetchUrls());
      })
      .catch((error) => {
        dispatch(loginUserFailure(error));
        alert(`An error was occurred: ${error}`);
      });
  }
};


function shouldRefreshTokens(accessToken) {
  if (!accessToken) {
    return false;
  }
  let payload = atob(accessToken.split('.')[1]);
  let expireAt = payload.exp;
  let utcNow = Math.round(Date.now() / 1000);
  return expireAt <= utcNow;
}


export const refreshTokensIfShould = () => {
  return (dispatch, getState) => {
    const user = getState().userReducer;
    const { refreshToken, accessToken } = user;
    if (shouldRefreshTokens(accessToken)) {
      dispatch(refreshTokensRequest());
      return myFetch(`${ROOT_URL}/auth/tokens`, "PUT", {"refresh_token": refreshToken})
        .then((response) => {
          if (!response.isSuccess) {
              throw response.error;
            }
            return response.data;
        })
        .then((data) => {
          dispatch(refreshTokensSuccess(data["created"]));
        })
        .catch((error) => {
          dispatch(refreshTokensFailure(error));
          alert(`An error was occurred: ${error}`);
          dispatch(push('/login'));
        })
    }
    return Promise.resolve();
  };
};
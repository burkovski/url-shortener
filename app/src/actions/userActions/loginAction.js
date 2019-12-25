import { LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS } from "../actions";
import { myFetch, ROOT_URL } from "../../utils";
import { push } from "connected-react-router";


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
      })
      .catch((error) => {
        dispatch(loginUserFailure(error));
      });
  }
};
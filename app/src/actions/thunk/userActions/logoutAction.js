import { LOGOUT_USER_FAILURE, LOGOUT_USER_REQUEST, LOGOUT_USER_SUCCESS } from "../../actionTypes";
import { myFetch, ROOT_URL } from "../../../utils";
import { push } from "connected-react-router";

const logoutUserRequest = () => {
  return { type: LOGOUT_USER_REQUEST };
};


const logoutUserFailure = (error) => {
  return { type: LOGOUT_USER_FAILURE, error };
};


const logoutUserSuccess = () => {
  return { type: LOGOUT_USER_SUCCESS };
};


export const logoutUser = () => {
  return (dispatch, getState) => {

    dispatch(logoutUserRequest());

    myFetch(`${ROOT_URL}/auth/tokens`, "DELETE", { "refresh_token": getState().userReducer.refreshToken })
      .then((response) => {
        if (!response.isSuccess) {
          throw response.error;
        }
        return response.data;
      })
      .then((data) => {
        dispatch(push('/'));
        dispatch(logoutUserSuccess());
      })
      .catch((error) => {
        dispatch(logoutUserFailure(error));
      });
  };
};

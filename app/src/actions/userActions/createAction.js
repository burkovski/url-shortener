import { CREATE_USER_FAILURE, CREATE_USER_REQUEST, CREATE_USER_SUCCESS } from "../actions";
import { myFetch, ROOT_URL } from "../../utils";
import { push } from "connected-react-router";

const createUserRequest = () => {
  return { type: CREATE_USER_REQUEST };
};


const createUserFailure = (error) => {
  return {
    type: CREATE_USER_FAILURE,
    error
  };
};


const createUserSuccess = (data) => {
  return {
    type: CREATE_USER_SUCCESS,
    data,
  };
};


export const createUser = (email, password, rePassword) => {
  console.log("func", email);
  return (dispatch) => {
    if (password !== rePassword) {
      dispatch(createUserFailure("Passwords must be match!"));
      return;
    }

    dispatch(createUserRequest());

    myFetch(`${ROOT_URL}/auth/users`, "POST", {email, password})
      .then((response) => {
        if (!response.isSuccess) {
          throw response.error;
        }
        return response.data;
      })
      .then((data) => {
        dispatch(createUserSuccess(data));
        dispatch(push('/login'));
      })
      .catch((error) => {
        dispatch(createUserFailure(error));
      });
  };
};
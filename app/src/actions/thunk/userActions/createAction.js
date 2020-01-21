import { CREATE_USER_FAILURE, CREATE_USER_REQUEST, CREATE_USER_SUCCESS } from "../../actionTypes";
import { myFetch, ROOT_URL } from "../../../utils";
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


export const createUser = (email, password) => {
  return (dispatch) => {
    dispatch(createUserRequest());
    console.log("Password:", password);
    myFetch(`${ROOT_URL}/auth/users`, "POST", {email, password})
      .then((response) => {
        if (!response.isSuccess) {
          throw response.error;
        }
        return response.data;
      })
      .then(() => {
        dispatch(createUserSuccess());
        if (confirm(`Your account <${email}> has been created. Do you want to login?`)) {
          dispatch(push("/login"));
        }
      })
      .catch((error) => {
        dispatch(createUserFailure(error));
        alert(`An error was occurred: ${error}`);
      });
  };
};
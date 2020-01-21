import { takeEvery, put, call } from "redux-saga/effects";

import {CREATE_USER, CREATE_USER_FAILURE, CREATE_USER_REQUEST, CREATE_USER_SUCCESS} from "../../actionTypes";
import {myFetch, ROOT_URL} from "../../../utils";
import {history} from "../../../configureStore";


export const createUser = (email, password) => {
  return { type: CREATE_USER, email, password };
};


export const createUserRequest = () => {
  return { type: CREATE_USER_REQUEST };
};


const createUserFailure = (error) => {
  return {
    type: CREATE_USER_FAILURE,
    error
  };
};


const createUserSuccess = () => {
  return {
    type: CREATE_USER_SUCCESS,
  };
};


const apiCreateUser = (email, password) => {
  return myFetch(`${ROOT_URL}/auth/users`, "POST", {email, password})
    .then((response) => {
      if (!response.isSuccess) {
        throw response.error;
      }
      return response.data;
    })
};


function* handleCreateUser(action) {
  const { email, password } = action;
  try {
    yield put(createUserRequest());
    yield call(apiCreateUser, email, password);
    yield put(createUserSuccess());
    if (confirm("Your account nas been created. Do you want to login?")) {
      yield call(history.push, "/login");
    }
  } catch (error) {
    yield put(createUserFailure());
    alert(`Account wasn't created: ${error}`);
  }
}


export function* watchCreateUser() {
  yield takeEvery(CREATE_USER, handleCreateUser);
}

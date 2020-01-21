import { takeEvery, put, call } from "redux-saga/effects";
import { history } from "../../../configureStore";
import {LOGIN_USER, LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS} from "../../actionTypes";
import {myFetch, ROOT_URL} from "../../../utils";
import {fetchUrls} from "../../saga/urlsActions/fetchSaga";


export const loginUser = (email, password) => {
  return { type: LOGIN_USER, email, password };
};


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


const apiLoginUser = (email, password) => {
  return myFetch(`${ROOT_URL}/auth/tokens`, "POST", {email, password})
    .then((response) => {
      if (!response.isSuccess) {
        throw response.error;
      }
      return response.data;
    })
};


function* handleLoginUser(action) {
  const { email, password } = action;
  try {
    yield put(loginUserRequest());
    const apiResponse = yield call(apiLoginUser, email, password);
    yield put(loginUserSuccess(apiResponse["created"], email));
    yield call(history.push, "/");
    yield put(fetchUrls());
  } catch (error) {
    yield put(loginUserFailure(error));
    alert(`Can't log in: ${error}`);
  }
}


export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, handleLoginUser);
}
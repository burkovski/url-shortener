import { takeEvery, select, put, call } from "redux-saga/effects";
import {LOGOUT_USER, LOGOUT_USER_FAILURE, LOGOUT_USER_REQUEST, LOGOUT_USER_SUCCESS} from "../../actionTypes";
import {myFetch, ROOT_URL} from "../../../utils";
import {history} from "../../../configureStore";


export const logoutUser = () => {
  return { type: LOGOUT_USER };
};

const logoutUserRequest = () => {
  return { type: LOGOUT_USER_REQUEST };
};


const logoutUserFailure = (error) => {
  return { type: LOGOUT_USER_FAILURE, error };
};


const logoutUserSuccess = () => {
  return { type: LOGOUT_USER_SUCCESS };
};


const apiLogoutUser = (refreshToken) => {
  return myFetch(`${ROOT_URL}/auth/tokens`, "DELETE", { "refresh_token": refreshToken })
    .then((response) => {
      if (!response.isSuccess) {
        throw response.error;
      }
      return response.data;
    })
};


function* handleLogoutUser() {
  const refreshToken = yield select(store => store.userReducer.refreshToken);
  try {
    yield put(logoutUserRequest());
    yield call(apiLogoutUser, refreshToken);
    yield put(logoutUserSuccess());
    yield call(history.push, "/");
  } catch (error) {
    yield put(logoutUserFailure());
    alert(`Can't log out: ${error}`);
  }
}


export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, handleLogoutUser);
}

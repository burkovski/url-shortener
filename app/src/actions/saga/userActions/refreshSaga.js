import { takeEvery, put, call, select } from "redux-saga/effects";
import {
  REFRESH_TOKENS,
  REFRESH_TOKENS_FAILURE,
  REFRESH_TOKENS_REQUEST,
  REFRESH_TOKENS_SUCCESS
} from "../../actionTypes";
import {myFetch, ROOT_URL} from "../../../utils";


export function shouldRefreshTokens(accessToken) {
  if (!accessToken) {
    return false;
  }
  let payload = atob(accessToken.split('.')[1]);
  let expireAt = payload.exp;
  let utcNow = Math.round(Date.now() / 1000);
  return expireAt <= utcNow;
}


export const refreshTokens = () => {
  return { type: REFRESH_TOKENS };
};


const refreshTokensRequest = () => {
  return { type: REFRESH_TOKENS_REQUEST };
};


const refreshTokensSuccess = (tokens) => {
  return { type: REFRESH_TOKENS_SUCCESS, tokens };
};


const refreshTokensFailure = (error) => {
  return { type: REFRESH_TOKENS_FAILURE, error   };
};


const apiRefreshTokens = (refreshToken) => {
  return myFetch(`${ROOT_URL}/auth/tokens`, "PUT", {"refresh_token": refreshToken})
    .then((response) => {
      if (!response.isSuccess) {
        throw response.error;
      }
      return response.data;
    })
};


function* handleRefreshTokens() {
  const tokens = yield select(store => store.userReducer);
  const { accessToken, refreshToken } = tokens;
  try {
    if (!shouldRefreshTokens(accessToken)) {
      yield put(refreshTokensSuccess({"refresh_token": refreshToken, "token": accessToken}));
      return;
    }
    yield put(refreshTokensRequest());
    const apiResponse = yield call(apiRefreshTokens, refreshToken);
    yield put(refreshTokensSuccess(apiResponse["created"]));
  } catch (error) {
    yield put(refreshTokensFailure(error));
    alert(`Can't refresh: ${error}`);
  }
}


export function* watchRefreshTokens() {
  yield takeEvery(REFRESH_TOKENS, handleRefreshTokens);
}


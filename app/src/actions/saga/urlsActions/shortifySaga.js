import { takeEvery, take, call, select, put } from "redux-saga/effects";
import {SHORTIFY_URL, SHORTIFY_URL_FAILURE, SHORTIFY_URL_REQUEST, SHORTIFY_URL_SUCCESS, REFRESH_TOKENS_SUCCESS} from "../../actionTypes";
import {myFetch, ROOT_URL} from "../../../utils";
import {refreshTokens} from "../userActions/refreshSaga";


export const shortifyUrl = (longUrl, ttlDays) => {
  return { type: SHORTIFY_URL, longUrl, ttlDays };
};


const shortifyUrlRequest = () => {
  return { type: SHORTIFY_URL_REQUEST };
};


const shortifyUrlFailure = (error) => {
  return {
    type: SHORTIFY_URL_FAILURE,
    error
  };
};


const shortifyUrlSuccess = (data) => {
  return {
    type: SHORTIFY_URL_SUCCESS,
    data
  };
};


const expireAt = (ttlDays) => {
  const utcNow = Math.round(Date.now() / 1000);
  const ttlSeconds = ttlDays * 86400;
  return utcNow + ttlSeconds;
};


const apiShortifyUrl = (url, exp, accessToken) => {
  return myFetch(`${ROOT_URL}/urls/shortify`, "POST",
    {"url_long": url, "expire_at": exp},
    accessToken ? { "Authorization": `Bearer ${accessToken}` } : null)
    .then((response) => {
      if (!response.isSuccess) {
        throw response.error;
      }
      return response.data;
    })
};


function* handleShortifyUrl(action) {
  const { longUrl, ttlDays } = action;
  yield put(refreshTokens());
  yield take(REFRESH_TOKENS_SUCCESS);
  const accessToken = yield select(state => state.userReducer.accessToken);
  try {
    yield put(shortifyUrlRequest());
    const apiResponse = yield call(apiShortifyUrl, longUrl, expireAt(ttlDays), accessToken);
    yield put(shortifyUrlSuccess(apiResponse));
  } catch (error) {
    yield put(shortifyUrlFailure(error));
    alert(`URL wasn't shorted: ${error}`);
  }
}


export function* watchShortifyUrl() {
  yield takeEvery(SHORTIFY_URL, handleShortifyUrl);
}

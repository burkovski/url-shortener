import { takeEvery, put, call, select, take } from "redux-saga/effects";
import { refreshTokens } from "../userActions/refreshSaga";

import {
  FETCH_URLS,
  FETCH_USER_OWNED_URLS_FAILURE,
  FETCH_USER_OWNED_URLS_REQUEST,
  FETCH_USER_OWNED_URLS_SUCCESS, REFRESH_TOKENS_SUCCESS
} from "../../actionTypes";
import { myFetch, ROOT_URL } from "../../../utils";


export const fetchUrls = () => {
  return { type: FETCH_URLS };
};


const fetchUrlsRequest = () => {
  return { type: FETCH_USER_OWNED_URLS_REQUEST };
};


const fetchUrlsFailure = (error) => {
  return {
    type: FETCH_USER_OWNED_URLS_FAILURE,
    error
  };
};


const fetchUrlsSuccess = (urlsList) => {
  return {
    type: FETCH_USER_OWNED_URLS_SUCCESS,
    urlsList
  };
};


const shouldFetch = (store) => {
  return !store.inProcessing;
};


const apiFetchUrls = (accessToken) => {
  return myFetch(`${ROOT_URL}/urls/owned`, "GET", null,
    {"Authorization": `Bearer ${accessToken}`})
    .then((response) => {
      if (!response.isSuccess) {
        throw response.error;
      }
      return response.data;
    })
};


function* handleFetchUrls() {
  yield put(refreshTokens());
  yield take(REFRESH_TOKENS_SUCCESS);
  try {
    const accessToken = yield select(state => state.userReducer.accessToken);
    yield put(fetchUrlsRequest());
    const urlsList = yield call(apiFetchUrls, accessToken);
    yield put(fetchUrlsSuccess(urlsList));
  } catch (error) {
    console.log(error);
    alert(`URL's wasn't fetched: ${error}`);
    yield put(fetchUrlsFailure(error));
  }
}


export function* watchFetchUrls() {
  yield takeEvery(FETCH_URLS, handleFetchUrls);
}
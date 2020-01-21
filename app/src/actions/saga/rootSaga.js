import { all } from "redux-saga/effects";
import { watchLoginUser } from "./userActions/loginSaga";
import { watchFetchUrls } from "./urlsActions/fetchSaga";
import { watchRefreshTokens } from "./userActions/refreshSaga";
import { watchShortifyUrl } from "./urlsActions/shortifySaga";
import { watchLogoutUser } from "./userActions/logoutSaga";
import { watchCreateUser } from "./userActions/signupSaga";


export default function* rootSaga() {
  yield all([
    watchLoginUser(),
    watchFetchUrls(),
    watchRefreshTokens(),
    watchShortifyUrl(),
    watchLogoutUser(),
    watchCreateUser()
  ]);
}

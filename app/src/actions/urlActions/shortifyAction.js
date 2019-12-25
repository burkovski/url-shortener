import {
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS,
  SHORTIFY_URL_FAILURE,
  SHORTIFY_URL_REQUEST,
  SHORTIFY_URL_SUCCESS
} from "../actions";
import {myFetch, ROOT_URL, shouldRefreshTokens} from "../../utils";


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
  const payload = JSON.parse(atob(tokens["token"].split('.')[1]));
  const userId = payload["user_id"];
  return {
    type: LOGIN_USER_SUCCESS,
    tokens,
    email,
    userId
  };
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


export const shortifyUrl = (url, ttlDays) => {
  return (dispatch, getState) => {
    const { userReducer, urlReducer } = getState();
    const { email, accessToken, refreshToken } = userReducer;
    const utcNow = Math.round(Date.now() / 1000);
    const ttlSeconds = ttlDays * 86400;
    const expireAt = utcNow + ttlSeconds;
    console.log("expireAt:", expireAt, ttlDays, ttlSeconds, utcNow);

    if (shouldRefreshTokens(accessToken)) {
      dispatch(loginUserRequest());
      myFetch(`${ROOT_URL}/api/auth/tokens`, "PUT", {"refresh_token": refreshToken})
        .then((response) => {
          if (!response.isSuccess) {
            throw response.error;
          }
          return response.data;
        })
        .then((data) => {
          dispatch(loginUserSuccess(data["created"], email));
        })
        .catch((error) => {
          dispatch(loginUserFailure(error));
        });

      return;
    }

    dispatch(shortifyUrlRequest());
    myFetch(
      `${ROOT_URL}/urls/shortify`, "POST",
      {"url_long": url, "expire_at": expireAt},
      accessToken ? { "Authorization": `Bearer ${accessToken}` } : null,
    )
      .then((response) => {
        if (!response.isSuccess) {
          throw response.error;
        }
        return response.data;
      })
      .then((data) => {
        dispatch(shortifyUrlSuccess(data));
      })
      .catch((error) => {
        dispatch(shortifyUrlFailure(error));
      })
  };
};

import {
  SHORTIFY_URL_FAILURE,
  SHORTIFY_URL_REQUEST,
  SHORTIFY_URL_SUCCESS
} from "../../actionTypes";
import { refreshTokensIfShould } from "../userActions/loginAction";
import { myFetch, ROOT_URL } from "../../../utils";


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


export const shortifyUrl = (url, ttlDays) => {
  return (dispatch, getState) => {

    refreshTokensIfShould();
    const { accessToken } = getState().userReducer;

    dispatch(shortifyUrlRequest());

    myFetch(
      `${ROOT_URL}/urls/shortify`, "POST",
      {"url_long": url, "expire_at": expireAt(ttlDays)},
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
        alert(`An error was occurred: ${error}`);
      })
  };
};

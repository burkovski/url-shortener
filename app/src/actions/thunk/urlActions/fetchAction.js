import {
  FETCH_URLS,
  FETCH_USER_OWNED_URLS_FAILURE,
  FETCH_USER_OWNED_URLS_REQUEST,
  FETCH_USER_OWNED_URLS_SUCCESS,
} from "../../actionTypes";
import { refreshTokensIfShould } from "../userActions/loginAction";
import { myFetch, ROOT_URL } from "../../../utils";


// const fetchUrls = () => {
//   return { type:FETCH_URLS };
// };


const fetchUrlsRequest = () => {
  return { type: FETCH_USER_OWNED_URLS_REQUEST };
};


const fetchUrlsFailure = (error) => {
  return {
    type: FETCH_USER_OWNED_URLS_FAILURE,
    error
  };
};


const fetchUrlsSuccess = (data) => {
  return {
    type: FETCH_USER_OWNED_URLS_SUCCESS,
    data
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


export const fetchUrls = () => {
  return (dispatch, getState) => {
    if (shouldFetch(getState().urlReducer)) {
      dispatch(refreshTokensIfShould())
        .then(() => {
          dispatch(fetchUrlsRequest());
          apiFetchUrls(getState().userReducer)
            .then((data) => {
              dispatch(fetchUrlsSuccess(data));
            })
            .catch((error) => {
              dispatch(fetchUrlsFailure(error));
              alert(`An error was occurred: ${error}`);
            });
      });
    }
  }
};

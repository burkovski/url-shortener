import {
  SHORTIFY_URL_REQUEST,
  SHORTIFY_URL_FAILURE,
  SHORTIFY_URL_SUCCESS,
  FETCH_USER_OWNED_URLS_REQUEST,
  FETCH_USER_OWNED_URLS_FAILURE,
  FETCH_USER_OWNED_URLS_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
   REFRESH_URLS_BUTTON_CLICK
} from "../actions/actionTypes";


const initialState = {
  inProcessing: false,
  urls: null,
  shortUrl: null,
  error:null
};


export const urlReducer =  (state=initialState, action) => {
  switch (action.type) {
    case SHORTIFY_URL_REQUEST:
    case FETCH_USER_OWNED_URLS_REQUEST:
      return {
        ...state,
        inProcessing: true
      };
    case SHORTIFY_URL_FAILURE:
    case FETCH_USER_OWNED_URLS_FAILURE:
      return {
        ...state,
        inProcessing: false,
        error: action.error
      };
    case SHORTIFY_URL_SUCCESS:
      return {
        ...state,
        inProcessing: false,
        shortUrl: action.data["created"]
      };
    case FETCH_USER_OWNED_URLS_SUCCESS:
      return {
        ...state,
        inProcessing: false,
        urls: action.urlsList,
      };
    case LOGOUT_USER_SUCCESS:
    case LOGIN_USER_SUCCESS:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
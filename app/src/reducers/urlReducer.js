import {
  SHORTIFY_URL_REQUEST,
  SHORTIFY_URL_FAILURE,
  SHORTIFY_URL_SUCCESS,
  FETCH_USER_OWNED_URLS_REQUEST,
  FETCH_USER_OWNED_URLS_FAILURE,
  FETCH_USER_OWNED_URLS_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS
} from "../actions/actions";


const initialState = {
  inProcessing: false,
  didInvalidate: false,
  noUrlsYet: false,
  urls: [],
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
        didInvalidate: true,
        shortUrl: action.data["created"]
      };
    case FETCH_USER_OWNED_URLS_SUCCESS:
      return {
        ...state,
        inProcessing: false,
        didInvalidate: false,
        urls: action.data,
        noUrlsYet: action.data === []
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
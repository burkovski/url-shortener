import {
  CREATE_USER_REQUEST,
  CREATE_USER_FAILURE,
  CREATE_USER_SUCCESS,
  LOGIN_USER_REQUEST,
  LOGIN_USER_FAILURE,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_REQUEST,
  LOGOUT_USER_FAILURE,
  LOGOUT_USER_SUCCESS,
  REFRESH_TOKENS_REQUEST,
  REFRESH_TOKENS_FAILURE,
  REFRESH_TOKENS_SUCCESS
} from "../actions/actionTypes";


const initialState = {
  email: null,
  userId: null,
  accessToken: null,
  refreshToken: null,
  inProcessing: false,
  error: null
};


export const userReducer =  (state=initialState, action) => {
  switch (action.type) {
    case CREATE_USER_REQUEST:
    case LOGIN_USER_REQUEST:
    case LOGOUT_USER_REQUEST:
    case REFRESH_TOKENS_REQUEST:
      return {
        ...state,
        inProcessing: true
      };
    case CREATE_USER_FAILURE:
    case LOGIN_USER_FAILURE:
    case LOGOUT_USER_FAILURE:
    case REFRESH_TOKENS_FAILURE:
      return {
        ...state,
        inProcessing: false,
        error: action.error
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        inProcessing: false,
      };
    case LOGIN_USER_SUCCESS:
      const tokens = action.tokens;
      const accessToken = tokens["token"];
      const refreshToken = tokens["refresh_token"];
      const jwt_payload = JSON.parse(atob(accessToken.split('.')[1]));
      const userId = jwt_payload["user_id"];
      return {
        ...state,
        inProcessing: false,
        email: action.email,
        userId,
        accessToken,
        refreshToken
      };
    case LOGOUT_USER_SUCCESS:
      return initialState;
    case REFRESH_TOKENS_SUCCESS:
      return {
        ...state,
        inProcessing: false,
        accessToken: action.tokens["token"],
        refreshToken: action.tokens["refresh_token"]
      };
    default:
      return state;
  }
};
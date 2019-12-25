import {
  CREATE_USER_REQUEST,
  CREATE_USER_FAILURE,
  CREATE_USER_SUCCESS,
  LOGIN_USER_REQUEST,
  LOGIN_USER_FAILURE,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_REQUEST,
  LOGOUT_USER_FAILURE,
  LOGOUT_USER_SUCCESS
} from "../actions/actions";


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
      return {
        ...state,
        inProcessing: true
      };
    case CREATE_USER_FAILURE:
    case LOGIN_USER_FAILURE:
    case LOGOUT_USER_FAILURE:
      return {
        ...state,
        inProcessing: false,
        error: action.error
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        inProcessing: false,
        email: action.email
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        inProcessing: false,
        email: action.email,
        userId: action.userId,
        accessToken: action.tokens["token"],
        refreshToken: action.tokens["refresh_token"]
      };
    case LOGOUT_USER_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
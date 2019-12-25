import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'

import { userReducer } from "./userReducer";
import { urlReducer } from "./urlReducer";


export default (history) => combineReducers({
  router: connectRouter(history),
  urlReducer,
  userReducer
});

import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { composeWithDevTools  } from "redux-devtools-extension";

import createRootReducer from './reducers/rootReducer'


const isProduction = false;
const composeFunc = isProduction ? compose : composeWithDevTools;
const composeEnhancer = isProduction ? composeFunc : composeFunc({trace: true, traceLimit: 25});
export const history = createBrowserHistory();



function configureStore(preloadedState) {
  return createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        routerMiddleware(history),
        thunk
      )
    )
  );
}


export default configureStore;

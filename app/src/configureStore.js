import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools  } from "redux-devtools-extension";

import createRootReducer from './reducers/rootReducer'
import rootSaga from "./actions/saga/rootSaga"

const isProduction = false;
const composeFunc = isProduction ? compose : composeWithDevTools;
const composeEnhancer = isProduction ? composeFunc : composeFunc({trace: true, traceLimit: 25});
export const history = createBrowserHistory();



// function configureStore(preloadedState) {
//   return createStore(
//     createRootReducer(history),
//     preloadedState,
//     composeEnhancer(
//       applyMiddleware(
//         routerMiddleware(history),
//         thunk
//       )
//     )
//   );
// }

const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunk, sagaMiddleware];

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const store = createStore(createRootReducer(history), bindMiddleware(middlewares));
sagaMiddleware.run(rootSaga);
export { store };


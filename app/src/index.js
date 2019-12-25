import React from "react";
import ReactDOM from "react-dom";
import "typeface-roboto"

import App from "./App";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import configureStore, { history } from "./configureStore";

const store = configureStore();


ReactDOM.render(
   <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
  document.getElementById('root')
);

import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { store, history } from "./configureStore";
import Routes from "./router";


// const store = configureStore();

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  );
};

export default App;

import React from "react";
import { Route, Switch } from "react-router-dom";

import Menu from "./containers/Menu";
import Home from "./containers/Home";
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import Cabinet from "./containers/Cabinet";


const Routes = () => {
  return (
    <>
      <Menu />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/signup' component={SignUp} />
        <Route exact path='/cabinet' component={Cabinet} />
      </Switch>
    </>
  );
};

export default Routes;

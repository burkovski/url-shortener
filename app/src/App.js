import { Route, Switch } from "react-router-dom";
import React from "react";

import Home from "./Home";
import Menu from "./Menu";
import SignIn from "./SignIn";
import Signup from "./Signup";
import Cabinet from "./Cabinet";


const App = (props) => {
  return (
    <div>
      <Menu/>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/login' component={SignIn}/>
        <Route path='/signup' component={Signup}/>
        <Route path='/cabinet' component={Cabinet}/>
      </Switch>
    </div>
  );
};

export default App;

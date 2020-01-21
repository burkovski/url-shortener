import React, { useState } from "react";

const Login = ({ loginClick }) => {
  const [login, setLogin] = useState('qwe@qwe.qwe');
  const [password, setPassword] = useState('qweqwe');

  const onLoginChange = (event) => {
    setLogin(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onLoginClick = () => {
    let trimmedLogin = login.trim();
    let trimmedPassword = password.trim();
    if (trimmedLogin && trimmedPassword) {
      loginClick(trimmedLogin, trimmedPassword);
    }
  };

  return (
    <div className="login-component">
      <input type="text" onChange={onLoginChange} value={login} />
      <br/>
      <input type="text" onChange={onPasswordChange} value={password} />
      <br/>
      <button onClick={onLoginClick}>Login</button>
    </div>
  );
};


export default Login;
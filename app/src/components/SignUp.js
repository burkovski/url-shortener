import React, { useState } from "react";


const SignUp = ({ signUpClick }) => {
  const [login, setLogin] = useState('qaz@qaz.qaz');
  const [password, setPassword] = useState('qazwsx');

    const onLoginChange = (event) => {
    setLogin(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onSingUpClick = () => {
    let trimmedLogin = login.trim();
    let trimmedPassword = password.trim();
    if (trimmedLogin && trimmedPassword) {
      signUpClick(trimmedLogin, trimmedPassword);
    }
  };

  return (
    <div className="signup-component">
      <input type="text" onChange={onLoginChange} value={login} />
      <br/>
      <input type="text" onChange={onPasswordChange} value={password} />
      <br/>
      <button onClick={onSingUpClick} >Sign Up</button>
    </div>
  );
};


export default SignUp;

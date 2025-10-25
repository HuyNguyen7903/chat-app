import React, { useState } from "react";
import LoginForm from "./components/AuthForm/LoginForm";
import SignupForm from "./components/AuthForm/SignupForm";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <LoginForm onSwitch={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export default App;

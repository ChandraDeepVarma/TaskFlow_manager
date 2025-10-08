import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import TaskManager from "./components/TaskManager";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [showSignup, setShowSignup] = useState(false);

  if (!isLoggedIn) {
    if (showSignup) {
      return (
        <div>
          <Signup
            onSignupSuccess={() => setShowSignup(false)}
            handleSetShowSignup={() => setShowSignup(false)}
          />{" "}
          {/* <button onClick={() => setShowSignup(false)}>Go to Login</button> */}
        </div>
      );
    } else {
      return (
        <div>
          <Login
            onLoginSuccess={() => setIsLoggedIn(true)}
            handleSetShowSignup={() => setShowSignup(true)}
          />
          {/* <button onClick={() => setShowSignup(true)} style={{ color: "red" }}>
            Go to Signup
          </button> */}
        </div>
      );
    }
  }

  return (
    <TaskManager
      onLogout={() => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }}
    />
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Register from "./components/Register";
import Protected from "./components/Protected";
import Content from "./components/Content";

export const UserContext = React.createContext([]);

function App() {
  const [user, setUser] = useState({});
  // const [loading, setLoading] = useState(true);

  const logOutCallback = async () => {
    await fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include", // Needed to include the cookie
    });
    // Clear user from context
    setUser({});
    // Navigate back to startpage
    Navigate("/");
  };

  // First thing, check if a refreshtoken exist
  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (
        await fetch("http://localhost:8080/refresh_token", {
          method: "POST",
          credentials: "include", // Needed to include the cookie
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      setUser({
        accesstoken: result.accesstoken,
      });
      //setLoading(false);
    }
    checkRefreshToken();
  }, []);

  // if (loading) return <div>Loading ...</div>;

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="app">
        <Navigation logOutCallback={logOutCallback} />
        <Routes id="router">
          <Login path="login" />
          <Register path="register" />
          <Protected path="protected" />
          <Content path="/" />
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;

// https://reactrouter.com/en/main/upgrading/reach
// guide to change from reach/router to react router

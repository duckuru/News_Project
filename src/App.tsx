import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import Profile from "./page/Profile";
import Home from "./page/Home";
import { UserContext } from "./context/UserContext";
import { useState, useEffect, useContext } from "react";
import NewsDetail from "./page/NewsDetail";
import TopNews from "./page/TopNews";
import Navbar from "./components/navbar/navbar";

function App() {
  const { state, dispatch } = useContext(UserContext);

  //state for open and close dialog(login, signup dialog)
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  //useEffect for getting user data after login and setting up user, else it will disappear on refresh
  useEffect(() => {
    fetch("http://localhost:8080/users/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "SET_USER", payload: data });
      })
      .finally(() => setIsLoading(false));
  }, []);

  //handle login fnction
  const handleLoginClick = async (username: string, password: string) => {
    const res = await fetch("http://localhost:8080/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg);
    }

    const data = await res.json();
    dispatch({ type: "SET_USER", payload: data });
    return data;
  };

  //handle signup
  const handleSignupClick = async (
    username: string,
    password: string,
    conpassword: string
  ) => {
    if (!username || !password || !conpassword) {
      throw new Error("All fields are required");
    }
    if (password !== conpassword) {
      throw new Error("Passwords must match");
    }

    const res = await fetch("http://localhost:8080/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg); // This rejects promise and Navbar can catch
    }

    const data = await res.json();
    dispatch({ type: "SET_USER", payload: data });
    return data; // success
  };

  //handle logout
  const handleLogoutClick = () => {
    fetch("http://localhost:8080/users/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.text())
      .then((data) => {
        dispatch({ type: "LOGOUT_USER" });
        console.log(data);
      });
  };

  return (
    <BrowserRouter>
      <Navbar
        onLogin={handleLoginClick}
        onSignup={handleSignupClick}
        user={state}
        loginOpen={loginOpen}
        setLoginOpen={setLoginOpen}
        signupOpen={signupOpen}
        setSignupOpen={setSignupOpen}
      />
      <Routes>
        <Route
          path="/"
          element={<Home user={state} isLoading={isLoading} />}
        ></Route>
        <Route
          path="/top"
          element={<TopNews user={state} isLoading={isLoading} />}
        ></Route>
        <Route
          path="/profile"
          element={
            <Profile
              user={state}
              onLogout={handleLogoutClick}
              dispatch={dispatch}
              isLoading={isLoading}
            />
          }
        ></Route>
        <Route
          path="/news/:id"
          element={<NewsDetail user={state} key={location.pathname} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

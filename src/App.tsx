import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/navbar/Navbar'
import './App.css'
import Profile from './page/Profile'
import Home from './page/Home'
import { UserContext } from './context/UserContext'
import { useState, useEffect, useContext } from 'react'
import NewsDetail from './page/NewsDetail'

function App() {
  const { state, dispatch } = useContext(UserContext);
  
  //state for open and close dialog(login, signup dialog)
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  //useEffect for getting user data after login and setting up user, else it will disappear on refresh
  useEffect(() => {
    fetch('http://localhost:8080/users/me', {
      credentials: 'include'
    }).then(res => res.json())
      .then(data => {
        //console.log for testing
        dispatch({ type: 'SET_USER', payload: data });
      });
    
  }, []);

  //handle login fnction
  const handleLoginClick = (loginUsername: string, loginPassword: string) => {
    console.log(loginUsername, loginPassword, 'this is login click')
    fetch('http://localhost:8080/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username: loginUsername, password: loginPassword })
    }).then(res => res.json())
      .then(data => {
        dispatch({ type: 'SET_USER', payload: data });
        setLoginOpen(false); //close the login dialog
      });
  }

  //handle signup
  const handleSignupClick = (username: string, password: string, conpassword: string) => {
    console.log(username, password, conpassword, 'this is signup click')
    if (username && password && conpassword) {
      if (password == conpassword) {
        fetch('http://localhost:8080/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ username, password })
        }).then(res => {
          if (!res.ok) {
            // signup failed
            return res.text().then(msg => {
              console.log("Signup failed:", msg);
              throw new Error(msg); // stop the chain
            });
          }
          return res.json();
        })
          .then(data => {
            console.log(data)
            dispatch({ type: 'SET_USER', payload: data });
            setSignupOpen(false); //close the signup dialog
          });
      } else {
        console.log("password must match")
      }
    }
  }
  //handle logout
  const handleLogoutClick = () => {
    fetch('http://localhost:8080/users/logout', {
      method: "POST",
      credentials: 'include'
    }).then(res => res.text())
      .then(data => {
        dispatch({ type: 'LOGOUT_USER' });
        console.log(data)
      });
  }

  const handleNewsPost = (headline: string, content: string) => {

  }

  return (
    <BrowserRouter>
      <Navbar onLogin={handleLoginClick} onSignup={handleSignupClick} user={state} loginOpen={loginOpen} setLoginOpen={setLoginOpen} signupOpen={signupOpen} setSignupOpen={setSignupOpen} onPost={handleNewsPost}/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/profile' element={<Profile user={state} onLogout={handleLogoutClick} />}></Route>
        <Route path='/news/:id' element={<NewsDetail/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

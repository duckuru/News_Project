import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/navbar/Navbar'
import './App.css'
import Profile from './page/Profile'
import Home from './page/Home'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

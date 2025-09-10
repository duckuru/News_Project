import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import MainLayouts from './layouts/MainLayouts'
import Navbar from './components/navbar/navbar';

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path='/' element={<MainLayouts/>}></Route>
        {/* <Route path='/profile' element={}></Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

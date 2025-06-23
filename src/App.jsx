import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import './App.css'
import LoginPage from './pages/loginPage.jsx'
import HomePage from './pages/HomePage.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes  path="/*">
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/home" element={<HomePage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )

}

export default App

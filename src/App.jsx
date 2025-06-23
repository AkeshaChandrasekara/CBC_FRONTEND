import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import './App.css'
import LoginPage from './pages/loginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/signUpPage.jsx' 
import AdminHomePage from './pages/adminHomePage.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/admin/*" element={<AdminHomePage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )

}

export default App
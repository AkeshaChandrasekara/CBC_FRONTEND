import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import './App.css'
import LoginPage from './pages/home/loginPage.jsx'
import HomePage from './pages/home/HomePage.jsx'
import SignUpPage from './pages/home/signUpPage.jsx' 
import AdminHomePage from './pages/home/adminHomePage.jsx'
import { Toaster } from 'react-hot-toast'
import FileUploadTest from './pages/test.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Toaster/>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/admin/*" element={<AdminHomePage/>}/>
           <Route path="/test" element={<FileUploadTest/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
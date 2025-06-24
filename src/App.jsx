import { useState } from 'react'
import './App.css'
import LoginPage from './pages/loginPage'
import HomePage from './pages/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminHomePage from './pages/adminHomePage'
import SignUpPage from './pages/signUpPage'
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
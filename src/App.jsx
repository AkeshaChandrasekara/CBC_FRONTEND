import { useState } from 'react'
import './App.css'
import LoginPage from './pages/loginPage'
import HomePage from './pages/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminHomePage from './pages/adminHomePage'
import { Toaster } from 'react-hot-toast'
import ResponseTest from './pages/admin/responseTest'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignInPage from './pages/signUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'





function App() {
  const [count, setCount] = useState(0)



  return (
    <div className='bg-primary'>
     <BrowserRouter>
      <Toaster position='top-right'/>
      <GoogleOAuthProvider clientId='132368913063-6mu0onmiop5f8jf38a86dtlvc5rb61eu.apps.googleusercontent.com'>
      <Routes path="/*">          
        <Route path="/*" element={<HomePage/>}/>   
        <Route path="/login" element={<LoginPage/>}/>
   <Route path="/signup" element={<SignInPage/>}/> 
   <Route path="/forgotpassword" element={<ForgotPasswordPage/>}/> 
        <Route path="/admin/*" element={<AdminHomePage/>}/>
        <Route path="/response" element={<ResponseTest/>}/> 
                   
      </Routes>
      </GoogleOAuthProvider>
     </BrowserRouter>
    </div>
  )
}

export default App

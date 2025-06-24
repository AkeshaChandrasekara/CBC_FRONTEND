import axios from "axios";
import { useState } from 'react'; 
import toast from "react-hot-toast";

export default function LoginPage() {

  function login(){
    axios.post("http://localhost:5000/api/users/login", {
      email: email,
      password: password
    
    })
      .then((response) => {
        console.log(response.data);
        if(response.data.user==null){
          toast.error(response.data.message)
          return
        }
        toast.success(response.data.message)
        localStorage.setItem("token", response.data.token);
        if(response.data.user.type == "admin"){
          window.location.href = "/admin"
        }else{
          window.location.href = "/home"
        }


      })
      .catch((error) => {
        console.error(error);
      });

  }

  const [email, setEmail] = useState("your email")
  const [password, setPassword] = useState('')
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <input 
          type="text" 
          placeholder="Email" 
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
         defaultValue={email}
         onChange={(e) => setEmail(e.target.value)}

        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
         defaultValue={password}
         onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors "onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}
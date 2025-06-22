import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProudctCard from './components/proudctCard.jsx'
import UserData from './components/userData.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
        <ProudctCard name="Laptop" price="$100" ></ProudctCard>
        <ProudctCard name="iPhone" price="$200" ></ProudctCard>
            <UserData/>


    </>
  )
}

export default App

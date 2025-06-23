import { useState } from "react"
import "./testing.css"

export default function Testing() {
   const [count, setCount] = useState(0)
   const [name, setName] = useState("Students")
   function increment() {
    console.log("incrementing")
        setCount(count + 1)
    }

    function decrement() {
        console.log("decrementing")
        setCount(count - 1)
    }
   
    function changeName(value) {
        setName(value)
    }
 return (

    <div className="background">
        <h1>{name}</h1>
        <button className="button" onClick={decrement}>-</button>
        <span>{count}</span>
        <button className="button" onClick={increment}>+</button>
        <div className="buttoncontainer"> 
            <button className="otherbutton" onClick={()=>changeName("Students")}>Students</button>
             <button className="otherbutton" onClick={()=>changeName("Teachers")}>Teachers</button>
              <button className="otherbutton"  onClick={()=>changeName("Admin")}>Admin</button>
              
        </div>

    </div>
 )
}
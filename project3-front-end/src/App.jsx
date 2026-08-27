import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home"

function App() {
  
const [user, setUser] = useState(null);

useEffect(() => {
  fetch('http://localhost:8080/session', {
    credentials: 'include'
  })
    .then(response => response.json())
    .then(login => {
      if(login.loggedIn) {
        setUser({
          username: login.username,
          id: login.id
        })
      } else {
        setUser(null)
      }
    })
    .catch(error => {
      console.log(error)
    })
}, []);


  return (
    <Routes>
      <Route path="/" element={<Login setUser={setUser}/>} />
      <Route path="/home" element={<Home user={user}/>} />
    </Routes>
  )
}

export default App

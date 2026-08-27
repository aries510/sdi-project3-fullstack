import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";

function App() {
  
const [user, setUser] = useState(null);

useEffect(() => {
  fetch('http://localhost:8080/login/session', {
    credentials: 'include'
  })
    .then(response => response.json())
    .then(login => {
      if(login.loggedIn) {
        setUser(login.username)
      } else {
        setUser(null)
      }
    })
    .catch(error => {
      console.error(error)
    })
}, []);


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Home" element={<Home />} />
    </Routes>
  )
}

export default App

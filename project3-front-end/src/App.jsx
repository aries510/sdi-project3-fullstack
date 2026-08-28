import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home"

function App() {
  
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

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
      setLoading(false)
    })
    .catch(error => {
      console.log(error)
    })
}, []);

if(loading){
  return <h2>Loading record...</h2>
}
  return (
    <Routes>
      <Route path="/" element={<Login setUser={setUser}/>} />
      <Route path="/home" element={user ? <Home user={user}/> : <Navigate to="/" />} />
    </Routes>
  )
};

export default App;

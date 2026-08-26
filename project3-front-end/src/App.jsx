import { useState, useEffect } from "react";

function App() {
  
const [user, setUser] = useState(null);

useEffect(() => {
  fetch('http://localhost:8080/login/session', {
    credentials: 'include'
  })
    .then(response => response.json)
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
    <>
      <div>
        <p>Hello</p>
      </div>
    </>
  )
}

export default App

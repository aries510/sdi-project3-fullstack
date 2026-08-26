import { useState, useEffect } from "react";


const [error, setError] = useState(null)




const logoutFetch = fetch('http://localhost:8080/login/logout', {
    method: 'POST',
    credentials: 'include'
});





const handleLogin = (event) => {
    event.preventDefault();

    fetch('https://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(login => {
            if(!login) {
                setError('Invalid login');
                return
            }
            // Update state
        })
        .catch(error => {
            console.error(error)
            setError("Server error")
        })
};
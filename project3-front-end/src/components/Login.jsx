import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Login({ setUser} ) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    // const [user, setUser] = useState(null);
    const navigate = useNavigate();


    const handleLogin = (event) => {
        event.preventDefault();
        setError(null);

        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error('Invalid login credentials.')
                }
                return response.json();
            })
            .then(login => {
                if(!login.success) {
                    setError('Invalid login');
                    return
                }
                return fetch('http://localhost:8080/session', {
                        credentials: 'include'
                        })
                            .then(response => response.json())
            })
            .then((session) => {
                if (session && session.loggedIn) {
                    setUser({ username: session.username, id: session.id });
                    navigate("/home");
                }
            })
            .catch(error => {
                console.log(error)
                setError("Server error")
            })
    };

    const logout = () => { 
        fetch('http://localhost:8080/logout', {
            method: 'POST',
            credentials: 'include'
        })
            .then(() => {
                setUser(null);
                navigate('/')
            })
            .catch((error) => {
                throw error("Logout failed:", error)
            })
    };

    return (
        <>
            <form
                onSubmit={handleLogin}
            >
                <div>
                    <label htmlFor="username"> Username </label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Enter username"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password"> Password </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder=""
                        required
                    />
                </div>
                <button
                    type="submit"
                >
                    Log In
                </button>
            </form>
        </>
    )

}

export default Login;
import { useState, useEffect } from "react";


function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const handleLogin = (event) => {
        event.preventDefault();
        setError(null);

        fetch('http://localhost:8080/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if(!response.ok) {
                    throw error('Invalid login credentials.')
                }
                response.json();
            })
            .then(login => {
                if(!login) {
                    setError('Invalid login');
                    return
                }
                setUser(login)
            })
            .catch(error => {
                console.error(error)
                setError("Server error")
            })
    };

    const logoutFetch = () => { 
        fetch('http://localhost:8080/login/logout', {
        method: 'POST',
        credentials: 'include'
        })
        .then(() => {
            setUser(null);
            setUsername('');
            setPassword('');
        })
        .catch((error) => {
            throw error("Logout failed:", error)
        })
    };
    
    if(user) {
        return (
            <>
                
            </>
        )
    }

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
                        value={{password}}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
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
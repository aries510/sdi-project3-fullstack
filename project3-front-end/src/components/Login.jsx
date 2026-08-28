import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Login({ setUser} ) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    // const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');


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

    const handleCreateAccount = (event) => {
        event.preventDefault();
        fetch('http://localhost:8080/users', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                username: newUsername,
                email: newEmail,
                password: newPassword
            })
        })
            .then(response => {
                if(!response.ok) throw new Error('Signup failed');
                return response.json()
            })
            .then((createdUser) => {
                setUser(createdUser)
                navigate('/home')
            })
            .catch((error) => {
                alert('Error creating account')
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
            <div>
                <button onClick={() => setIsCreatingAccount(true)}>Create an Account</button>
            </div>

            {isCreatingAccount && (
                <form onSubmit={handleCreateAccount}>
                    <h2>Create Account</h2>

                    <label>Username</label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(event) => setNewUsername(event.target.value)}
                        required
                    />

                    

                    <label>Email</label>
                    <input
                        type="text"
                        value={newEmail}
                        onChange={(event) => setNewEmail(event.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        required
                    />

                    <button type="submit">Submit</button>
                    <button onClick={() => setIsCreatingAccount(false)}>Cancel</button>
                </form>
            )}
        </>
    )

}

export default Login;
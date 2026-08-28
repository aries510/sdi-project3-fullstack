import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home({ user }) {
    const [gear, setGear] = useState([]);
    const [training, setTraining] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate('/');
            return
        };
        fetch(`http://localhost:8080/users/${user.id}`, {credentials: 'include'})
            .then(response => response.json())
            .then((user) => {
                setUserInfo(user);
                fetch(`http://localhost:8080/gear/${user.id}`)
                    .then(response => response.json())
                    .then(setGear);
                fetch(`http://localhost:8080/training/${user.id}`)
                    .then(response => response.json())
                    .then(setTraining);
            });
    }, [user]);

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
                throw new Error("Logout failed:", error)
            })
    };

    return(
        <>
            <header>
                <h1>Welcome, {user.username}</h1>

                <div>
                    <h2>{user.username}'s Dashboard</h2>
                    {userInfo && (
                        <div>
                            <p>ID: {userInfo.id}</p>
                            <p>Username: {userInfo.username}</p>
                            <p>Email: {userInfo.email}</p>
                        </div>
                    )}
                    <button onClick={logout}> Logout </button>
                </div>
            </header>

            <div>
                

                <div>
                    <h2>Your Gear</h2>
                    {gear.length === 0 ? (
                        <p>No gear yet.</p>
                    ) : (
                        gear.map(item => (
                            <p key={item.id}>Name: {item.name} | Category: {item.category} | Brand: {item.brand} | Expires: {item.expiration_date} | Crashed: {item.crashed} </p>
                        ))
                    )}
                </div>

                <div>
                    <h2>Your Training Records</h2>
                    {training.length === 0 ? (
                        <p>No training records yet.</p>
                    ) : (
                        training.map(record => (
                            <p key={record.id}> Course Name: {record.course_name} | Completed: {record.completion_date} | Due: {record.due_date} </p>
                        ))
                    )}
                </div>

            </div>
        </>
    )
};

export default Home;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Home({ user }) {
    const [gear, setGear] = useState([]);
    const [showAddGearModal, setShowAddGearModal] = useState(false);
    const [newGear, setNewGear] = useState({
        name: '',
        category: '',
        brand: '',
        manufactured_date: '',
        purchased_date: '',
        crashed: false
    });
    const [editingGear, setEditingGear] = useState(null);
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
                navigate('/')
            })
            .catch((error) => {
                throw new Error("Logout failed:", error)
            })
    };

    const handleAddGear = () => {
        if(!newGear.name || !newGear.category || !newGear.brand || !newGear.purchased_date) {
            alert('Please fill out required fields.');
            return
        }
        fetch('http://localhost:8080/gear', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: user.id,
                name: newGear.name,
                category: newGear.category,
                brand: newGear.brand,
                manufactured_date: newGear.manufactured_date || null,
                purchased_date: newGear.purchased_date,
                crashed: 'false'
            })
        })
            .then(response => response.json())
            .then(() => {
                fetch(`http://localhost:8080/gear/${user.id}`)
                    .then(response => response.json())
                    .then(setGear)
                setNewGear({
                    name: '',
                    category: '',
                    brand: '',
                    manufactured_date: '',
                    purchased_date: '',
                    crashed: false
                });
                setShowAddGearModal(false);
            })
            .catch((error) => console.log("Error adding gear:", error))
    };

    const handleUpdateGear = () => {
        if(!editingGear.purchased_date) {
            alert("Purchased date is required.")
            return
        }
        fetch(`http://localhost:8080/gear/${editingGear.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                manufactured_date: editingGear.manufactured_date || null,
                purchased_date: editingGear.purchased_date,
                crashed: editingGear.crashed
            })
        })
            .then(response => response.json())
            .then(() => {
                fetch(`http://localhost:8080/gear/${user.id}`)
                    .then(response => response.json())
                    .then(setGear)
                setEditingGear(null)
            })
            .catch((error) => console.log("Error updating gear:", error))
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
                        gear.map((item) => (
                            <p key={item.id}>
                                Name: {item.name} | Category: {item.category} | Brand: {item.brand} | Expires: {item.expiration_date} | Crashed: {item.crashed}
                                <button onClick={() => setEditingGear(item)}>
                                    Edit Gear
                                </button>
                            </p>
                            
                        ))
                    )}
                    <button onClick={() => setShowAddGearModal(true)}>
                        Add Gear
                    </button>
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

            {showAddGearModal && (
                <div className="modal-overlay">
                    <h2>Add New Gear</h2>

                    <label>Name: </label>
                    <input
                        type="text"
                        placeholder="(Required)"
                        value={newGear.name}
                        onChange={(event) => setNewGear({ ...newGear, name: event.target.value})}
                    />

                    <label>Category: </label>
                    <select
                        value={newGear.category}
                        onChange={(event) => setNewGear({ ...newGear, category: event.target.value})}
                    >
                        <option value=''></option>
                        <option value='Helmet'>Helmet</option>
                        <option value='Jacket'>Jacket</option>
                        <option value='Pants'>Pants</option>
                        <option value='Footwear'>Footwear</option>
                        <option value='Gloves'>Gloves</option>
                        <option value='Other'>Other</option>
                    </select>

                    <label>Brand: </label>
                    <input
                        type="text"
                        placeholder="(Required)"
                        value={newGear.brand}
                        onChange={(event) => setNewGear({ ...newGear, brand: event.target.value})}
                    />

                    <label>Manufactured Date:</label>
                    <input
                        type="date"
                        placeholder="(Optional)"
                        value={newGear.manufactured_date}
                        onChange={(event) => setNewGear({ ...newGear, manufactured_date: event.target.value})}
                    />

                    <label>Purchase Date:</label>
                    <input
                        type="date"
                        placeholder="(Required)"
                        value={newGear.purchased_date}
                        onChange={(event) => setNewGear({ ...newGear, purchased_date: event.target.value})}
                    />

                    <div className="modal-buttons">
                        <button onClick={handleAddGear}>Submit</button>
                        <button onClick={() => setShowAddGearModal(false)}>Cancel</button>
                    </div>

                </div>
            )}

            {editingGear !== null && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit Gear</h2>

                        <label>Manufactured Date:</label>
                        <input
                            type="date"
                            value={editingGear.manufactured_date || ""}
                            placeholder="(Optional)"
                            onChange={(event) => 
                                setEditingGear({
                                    ...editingGear,
                                    manufactured_date: event.target.value
                                })
                            }
                        />

                        <label>Purchased Date:</label>
                        <input
                            type="date"
                            value={editingGear.purchased_date}
                            onChange={(event) => 
                                setEditingGear({
                                    ...editingGear,
                                    purchased_date: event.target.value
                                })
                            }
                        />

                        <label>Crashed:</label>
                        <select
                            value={
                                editingGear.crashed === true ? "true" :
                                editingGear.crashed === false ? "false" :
                                "false"
                            }
                            onChange={(event) => 
                                setEditingGear({
                                    ...editingGear,
                                    crashed: event.target.value === "true"
                                })
                            }
                        >
                            <option value="false">False</option>
                            <option value="true">True</option>
                        </select>

                        <div className="modal-buttons">
                            <button onClick={handleUpdateGear}>Save Changes</button>
                            <button onClick={() => setEditingGear(null)}>Cancel</button>
                        </div>

                    </div>

                </div>
            )}
        </>
    )
};

export default Home;
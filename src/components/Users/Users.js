import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/users')
            .then(res => res.json())
            .then(data => setUsers(data))
    }, [])

    // DELETE USER
    const deleteUser = id => {
        const proceed = window.confirm('Are you sure, you want to delete');
        if (proceed) {
            const url = `http://localhost:5000/users/${id}`;
            fetch(url, {
                method: 'delete'
            })
                // update ui after delete
                .then(res => res.json())
                .then(data => {
                    if (data.deletedCount > 0) {
                        alert('Deleted Successfully');
                        const remainingUsers = users.filter(user => user._id !== id);
                        setUsers(remainingUsers);
                    }
                })
        }
    }

    // UPDATE USER

    let history = useHistory();
    const handleUpdateUser = id => {
        history.push(`/users/update/${id}`)
    }
    return (
        <div>
            <h2>Users Available: {users.length}</h2>
            <div>
                {
                    users.map(user => <p
                        key={user._id}
                    >{user.name} - {user.email}
                        <button onClick={() => { handleUpdateUser(user._id) }}>Update</button>
                        <button onClick={() => { deleteUser(user._id) }}>X</button>
                    </p>)
                }
            </div>
        </div>
    );
};

export default Users;
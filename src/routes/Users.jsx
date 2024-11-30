import React, { useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import ThemePicker from '../theme/ThemePicker'
import Headbar from '../components/Headbar'
import UsernameEmoji from '../components/UsernameEmoji'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import "../styles/users.css"

function Users() {
    const {users, userId, setUserId} = useContext(UserContext);
    let navigate = useNavigate();
    
    function switchUser(index) {
        setUserId(index);
        //reload page
        window.location.reload(false);
    }

    return (
        <>
            <div className="main">
                <ThemePicker />
                <Navbar />
                <div className="feed container">
                    <Headbar />
                    { users.map((user, index) => {
                        return (
                            <div className="search">
                                <div className="statusTop">
                                    <div className="statusTopLeft">
                                        <img className="statusProfileImg" src={user.avatar} alt="profile" />
                                        <div className="user">
                                            <span className="statusUsername"> {user.name || user.username} </span>
                                            {/* this is done to reduce the length of the fullname and prevent overflow */}
                                            <span className="userInstance">{user.username.length > 47 ? user.username.slice(0, 40) + '...' : user.username}</span>
                                        </div>
                                    </div>
                                    <div>
                                        {userId === index ? "Current User": 
                                            <button type="button" className="my-button" onClick={() => switchUser(index)}>Switch</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}
                    <div className='addUser'>
                        <button type="button" className="my-button" onClick={() => navigate("/")}>Add User</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Users
import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../context/UserContext";

function Profile(props){
    const {id} = useParams();
    const {currentUser} = useContext(UserContext);

    useEffect(() => {
        async function fetchUserProfile(){
            try {
                const response = await axios.post(`localhost:3000/api/v1/accounts/${id}`, currentUser);
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, []);

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="profile">
                <div className="profileTop">
                    <div className="profileTopLeft">
                        <img className="profileImg" src="https://picsum.photos/seed/picsum/200/300" alt="profile" />
                        <div className="user">
                            <span className="profileUsername" >username</span>
                            <span className="userInstance">username@instance</span>
                        </div>
                    </div>
                    <div className="postTopRight">
                    <button type="button" class="btn btn-outline-secondary">Edit Profile</button>
                    </div>
                </div>
                <div className="profileCenter">
                    <span className="profileText">this is my bio</span>
                </div>
            </div>
        </>
    );
}

export default Profile;

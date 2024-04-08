import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Status from "../components/Status";
import EditProfile from "../components/EditProfile";

function Profile(props){
    const {id} = useParams();
    const {currentUser} = useContext(UserContext);
    const [user, setUser] = useState({
        account: {
            avatar: "",
            username: "",
            acct: "",
            note: "",
        },
        statuses: {
            list: [],
        },
    });
    const [show, setShow] = useState(false)
    const sanitizedHtml = DOMPurify.sanitize(user.account.note);

    useEffect(() => {
        async function fetchUserProfile(){
            try {
                const response = await axios.post(`http://localhost:3000/api/v1/accounts/${id}`, currentUser);
                //console.log(response.data);
                setUser(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [user]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="profile">
                <div className="profileTop">
                    <div className="profileTopLeft">
                        <img className="profileImg" src={user.account.avatar} alt="profile" />
                        <div className="user">
                            <span className="profileUsername" >{user.account.username}</span>
                            <span className="userInstance">{user.account.username === user.account.acct ? `${user.account.username}@${currentUser.instance}` : user.account.acct}</span>
                        </div>
                    </div>
                    <div className="postTopRight">
                        <button type="button" class="btn btn-outline-secondary" onClick={handleShow}>Edit Profile</button>
                    </div>
                </div>
                <div className="profileCenter">
                    <span className="profileText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
                </div>
            </div>
            <EditProfile show={show} close={handleClose} display_name={user.account.display_name} note={user.account.note} />
            <div className="feed container">
                <div style={{textAlign: "center"}}>POSTS</div>
                {user.statuses.list.map(status => {
                    return <Status 
                        key={status.id}
                        id={status.id}
                        user_id={status.account.id}
                        prof={status.account.avatar}
                        name={status.account.username}
                        instance={currentUser.instance} 
                        fullname={status.account.acct} 
                        body={status.content} 
                        src={status.media_attachments.length ? status.media_attachments[0] : ""}
                        isUserProfile={id === currentUser.id}
                    />
                })}
            </div>
            
        </>
    );
}

export default Profile;

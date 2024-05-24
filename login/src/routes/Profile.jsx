import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Status from "../components/Status";
import EditProfile from "../components/EditProfile";
import ThemeSwitcher from "../components/ThemeSwitcher";
import "../styles/profile.css";

function Profile(props){
    const {id} = useParams();
    const {currentUser, isLoggedIn} = useContext(UserContext);
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
    const [following, setFollowing] = useState(false);
    const [show, setShow] = useState(false)
    const sanitizedHtml = DOMPurify.sanitize(user.account.note);
    let navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }

        fetchUserProfile();
    });

    useEffect(() => {
        checkRelation();
    }, []);

    async function fetchUserProfile(){
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/accounts/${id}`, currentUser);
            //console.log(response.data);
            setUser(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function checkRelation(){
        try {
            const response = await axios.get(`https://${currentUser.instance}/api/v1/accounts/relationships`, {
                params: {"id" : id},
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
            setFollowing(response.data[0].following);
            
        } catch (error) {
            console.log(error);
        }
    }

    async function handleFollow(){
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/accounts/${id}/follow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(true);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleUnfollow(){
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/accounts/${id}/unfollow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(false);
        } catch (error) {
            console.log(error);
        }
    }

    function formatData(data){
        let message = data;
        if(data > 1000){
            message = `${(data/1000).toFixed(2)}k`;
            data = data/1000;
            if(data > 100) message = `${Math.round(data)}k`;
        }
        return message; 
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="main">
            <Navbar />
            <Sidebar />
            <ThemeSwitcher />
            <div className="feed container">
                <div className="profile">
                    <div >
                        {user.account.header !== "https://mastodon.social/headers/original/missing.png" && <img className="profileHeader" src={user.account.header} />}
                    </div>
                    <div className="profileTop">
                        <div className="profileTopLeft">
                            <img className="profileImg" src={user.account.avatar} alt="profile" />
                            <div className="user">
                                <span className="profileUsername" >{user.account.display_name}</span>
                                <span className="profileUserInstance">{user.account.username === user.account.acct ? `${user.account.username}@${currentUser.instance}` : user.account.acct}</span>
                            </div>
                        </div>
                        <div className="profileTopRight">
                            {currentUser.id === id ? 
                                <button type="button" className="btn btn-outline-secondary" onClick={handleShow}>Edit Profile</button>
                            :
                                <>
                                    {following ? 
                                        <button type="button" className="btn btn-outline-secondary" onClick={handleUnfollow}>Unfollow</button> 
                                    : 
                                        <button type="button" className="btn btn-outline-secondary" onClick={handleFollow}>Follow</button>
                                    }
                                </>
                            }
                        </div>
                    </div>
                    <div className="profileStats"><strong><span>{formatData(user.account.followers_count)}</span> Followers <span>{formatData(user.account.following_count)}</span> Following</strong></div>
                    <div className="profileCenter">
                        <span className="profileText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
                    </div>
                </div>
                <EditProfile show={show} close={handleClose} display_name={user.account.display_name} note={user.account.note} />
            
                <h2 style={{textAlign: "center"}}>POSTS</h2>
                {user.statuses.list.map(status => {
                    return (status.in_reply_to_account_id === null && <Status 
                        key={status.id}
                        instance={currentUser.instance}
                        reblogged={status.reblog ? true : false}
                        post={status.reblog ? status.reblog : status}
                        postedBy={status.account}
                        isUserProfile={id === currentUser.id}
                    />)
                })}
            </div>
            
        </div>
    );
}

export default Profile;

import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { UserContext } from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Status from "../components/Status";
import EditProfile from "../components/EditProfile";
import Headbar from "../components/Headbar";
import "../styles/profile.css";
import ThemePicker from "../theme/ThemePicker";
import UsernameEmoji from "../components/UsernameEmoji";

function Profile(){
    const {id} = useParams();
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {setError, setToast} = useErrors();
    const [user, setUser] = useState({
            avatar: "",
            username: "",
            acct: "",
            note: "",
        });
    const [statuses, setStatuses] = useState([])
    const [following, setFollowing] = useState(false);
    const [followedBy, setFollowedBy] = useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const sanitizedHtml = DOMPurify.sanitize(user.note);
    let navigate = useNavigate();
    const [display_name, setDisplayName] = useState("");

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }
        fetchUserProfile();
    }, [id]);

    useEffect(() => {
        checkRelation();
    }, []);

    useEffect(() => {
        console.log(user);
    });

    async function fetchUserProfile(){
        try {
            setLoading(true);
            const response = await axios.post(`http://localhost:3000/api/v1/accounts/${id}`, currentUser);
            console.log(response.data)
            setUser(response.data.account);
            setStatuses(response.data.statuses.list);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError(error.response.data);;
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
            setFollowedBy(response.data[0].followed_by)
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
            setError(error.response.data);;;
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
            setError(error.response.data);
        }
    }

    async function handleDelete(event, id) {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await axios.delete(`https://${currentUser.instance}/api/v1/statuses/${id}`, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
            // console.log(response.data);
            setStatuses(() => statuses.filter(status => status.id !== id))
            setToast("Deleted Successfully!");
        } catch (error) {
            setError(error.response.data);
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
            <ThemePicker />
            <div className="feed container">
                <Headbar />
                {loading && <div className="loader"></div>}
                <div className="profile">
                    <div className="header-container">
                        {user.header !== "https://mastodon.social/headers/original/missing.png" && <img className="profileHeader" src={user.header} />}
                        {followedBy && <div className="followed-by">Follows you</div>}
                    </div>
                    <div className="profileTop">
                        <div className="profileTopLeft">
                            <img className="profileImg" src={user.avatar} alt="profile" />
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
                    <div className="user">
                        <span className="profileUsername"><UsernameEmoji name={user.display_name || user.username} emojis={user.emojis}/></span>
                        <span className="profileUserInstance">{user.username === user.acct ? `${user.username}@${currentUser.instance}` : user.acct}</span>
                    </div>
                    <div className="profileStats"><strong><span>{formatData(user.followers_count)}</span> Followers <span>{formatData(user.following_count)}</span> Following</strong></div>
                    <div className="profileCenter">
                        <span className="profileText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
                    </div>
                </div>
                <EditProfile show={show} close={handleClose} display_name={user.display_name} note={user.note} />
            
                <h2 style={{textAlign: "center"}}>POSTS</h2>
                {statuses.length ? statuses.map(status => {
                    return (status.in_reply_to_account_id === null && <Status 
                        key={status.id}
                        instance={currentUser.instance}
                        reblogged={status.reblog ? true : false}
                        post={status.reblog ? status.reblog : status}
                        postedBy={status.account}
                        isUserProfile={id === currentUser.id}
                        mentions={status.mentions}
                        delete={handleDelete}
                    />)
                }) : <p>No Posts Yet!</p>}
            </div>
            
        </div>
    );
}

export default Profile;

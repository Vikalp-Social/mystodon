import React, { useEffect, useContext, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import APIClient from "../apis/APIClient";
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

// Profile component is the main component that is rendered when the user visits a profile. 
// It fetches the profile of the user and displays the posts in the profile.
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
    const [maxId, setMaxId] = useState("");
    const [following, setFollowing] = useState(false);
    const [followedBy, setFollowedBy] = useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const sanitizedHtml = DOMPurify.sanitize(user.note);
    useBottomScrollListener(extendStatuses);   
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
        document.title = `${user.display_name || user.username} (@${user.username === user.acct ? `${user.username}@${currentUser.instance}` : user.acct}) | Vikalp`;
    });

    // function to fetch the profile details of the user
    async function fetchUserProfile(){
        try {
            setLoading(true);
            // const response = await APIClient.get(`/accounts/${id}`, {params: {instance: currentUser.instance}});
            const response = await APIClient.get(`/accounts/${id}`, {
                params: {
                    token: currentUser.token, 
                    instance: currentUser.instance, 
                    max_id: maxId
                }
            });
            setUser(response.data.account);
            setStatuses(response.data.statuses.list);
            setMaxId(response.data.statuses.max_id);
            setDisplayName(response.data.account.display_name);
            setLoading(false);
        } catch (error) {
            setError(error.response.data);;
        }
    }

    async function extendStatuses(){
        try {
            setLoading(true);
            // const response = await APIClient.get(`/accounts/${id}`, {params: {instance: currentUser.instance}});
            if(maxId === -1) return;
            const response = await APIClient.get(`/accounts/${id}`, {
                params: {
                    token: currentUser.token, 
                    instance: currentUser.instance, 
                    max_id: maxId
                }
            });
            setStatuses([...statuses, ...response.data.statuses.list]);
            setMaxId(response.data.statuses.max_id);
            setLoading(false);
        } catch (error) {
            setError(error.response.data);
        }
    }

    // function to check the relation of the user with the current user
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

    // function to follow the user
    async function handleFollow(){
        try {
            const response = await APIClient.post(`/accounts/${id}/follow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(true);
        } catch (error) {
            setError(error.response.data);;;
        }
    }

    // function to unfollow the user
    async function handleUnfollow(){
        try {
            const response = await APIClient.post(`/accounts/${id}/unfollow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(false);
        } catch (error) {
            setError(error.response.data);
        }
    }

    // function to delete the post
    async function handleDelete(event, id) {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await axios.delete(`https://${currentUser.instance}/api/v1/statuses/${id}`, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
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
                            {/* show edit profile button only if the user is the current user */}
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
                        <span className="profileUsername">{display_name === '' ? display_name : <UsernameEmoji key={user.id} name={user.display_name || user.username} emojis={user.emojis}/>}</span>
                        <span className="profileUserInstance">{user.username === user.acct ? `${user.username}@${currentUser.instance}` : user.acct}</span>
                    </div>
                    <div className="profileStats">
                        <strong>
                            <span className="stats">{formatData(user.followers_count)}</span> <span className="follow" onClick={() => navigate(`/profile/${id}/followers`)}>Followers </span> 
                            <span className="stats">{formatData(user.following_count)}</span> <span className="follow" onClick={() => navigate(`/profile/${id}/following`)}>Following</span>
                        </strong>
                    </div>
                    <div className="profileCenter">
                        <span className="profileText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
                    </div>
                </div>
                {user.note && <EditProfile show={show} close={handleClose} display_name={user.display_name} note={user.note} />}
            
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
                {maxId !== -1 && loading && <div className="loader"></div>}
            </div>
            
        </div>
    );
}

export default Profile;

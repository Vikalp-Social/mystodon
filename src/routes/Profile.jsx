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
import "../index.css";
import ThemePicker from "../theme/ThemePicker";
import UsernameEmoji from "../components/UsernameEmoji";

// Profile component is the main component that is rendered when the user visits a profile. 
// It fetches the profile of the user and displays the posts in the profile.
function Profile(){
    const { id } = useParams();
    const userContext = useContext(UserContext);
    const { setError, setToast } = useErrors();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        avatar: "",
        username: "",
        acct: "",
        note: "",
    });
    const [statuses, setStatuses] = useState([]);
    const [maxId, setMaxId] = useState("");
    const [following, setFollowing] = useState(false);
    const [followedBy, setFollowedBy] = useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [display_name, setDisplayName] = useState("");
    const sanitizedHtml = DOMPurify.sanitize(user.note);

    useBottomScrollListener(extendStatuses);   

    useEffect(() => {
        if(!userContext?.currentUser){
            navigate("/");
            return;
        }
        
        if(!id) {
            setError("Profile ID is missing");
            return;
        }
        
        fetchUserProfile(); 
    }, [id, userContext?.currentUser]);

    useEffect(() => {
        if(userContext?.currentUser && id) {
            checkRelation();
        }
    }, [userContext?.currentUser, id]);

    useEffect(() => {
        if(userContext?.currentUser) {
            document.title = `${user.display_name || user.username} (@${user.username === user.acct ? `${user.username}@${userContext.currentUser.instance}` : user.acct}) | Vikalp`;
        }
    }, [user, userContext?.currentUser]);

    // function to fetch the profile details of the user
    async function fetchUserProfile(){
        if(!userContext?.currentUser || !id) return;
        
        try {
            setLoading(true);
            const response = await axios.get(`https://${userContext.currentUser.instance}/api/v1/accounts/${id}`, {
                headers: {
                    Authorization: `Bearer ${userContext.currentUser.token}`,
                },
            });
            
            const statusesResponse = await axios.get(`https://${userContext.currentUser.instance}/api/v1/accounts/${id}/statuses`, {
                params: { max_id: maxId },
                headers: {
                    Authorization: `Bearer ${userContext.currentUser.token}`,
                },
            });
            
            setUser(response.data);
            setStatuses(statusesResponse.data);
            setMaxId(statusesResponse.data.length > 0 ? statusesResponse.data[statusesResponse.data.length - 1].id : -1);
            setDisplayName(response.data.display_name);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data || "Failed to fetch profile");
            setLoading(false);
        }
    }

    async function extendStatuses(){
        if(!userContext?.currentUser || !id || maxId === -1) return;
        
        try {
            setLoading(true);
            const response = await axios.get(`https://${userContext.currentUser.instance}/api/v1/accounts/${id}/statuses`, {
                params: { max_id: maxId },
                headers: {
                    Authorization: `Bearer ${userContext.currentUser.token}`,
                },
            });
            
            setStatuses([...statuses, ...response.data]);
            setMaxId(response.data.length > 0 ? response.data[response.data.length - 1].id : -1);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data || "Failed to load more posts");
            setLoading(false);
        }
    }

    // function to check the relation of the user with the current user
    async function checkRelation(){
        if(!userContext?.currentUser || !id) return;
        
        try {
            const response = await axios.get(`https://${userContext.currentUser.instance}/api/v1/accounts/relationships`, {
                params: {"id[]" : id},
                headers: {
                    Authorization: `Bearer ${userContext.currentUser.token}`,
                },
            });
            setFollowing(response.data[0].following);
            setFollowedBy(response.data[0].followed_by);
        } catch (error) {
            console.log(error);
        }
    }

    // function to follow the user
    async function handleFollow(){
        if(!userContext?.currentUser || !id) return;
        
        try {
            const response = await axios.post(`https://${userContext.currentUser.instance}/api/v1/accounts/${id}/follow`, null, {
                headers: {
                    Authorization: `Bearer ${userContext.currentUser.token}`,
                },
            });
            setFollowing(true);
        } catch (error) {
            setError(error.response?.data || "Failed to follow user");
        }
    }

    // function to unfollow the user
    async function handleUnfollow(){
        if(!userContext?.currentUser || !id) return;
        
        try {
            const response = await axios.post(`https://${userContext.currentUser.instance}/api/v1/accounts/${id}/unfollow`, null, {
                headers: {
                    Authorization: `Bearer ${userContext.currentUser.token}`,
                },
            });
            setFollowing(false);
        } catch (error) {
            setError(error.response?.data || "Failed to unfollow user");
        }
    }

    // function to delete the post
    async function handleDelete(event, statusId) {
        if(!userContext?.currentUser) return;
        
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await axios.delete(`https://${userContext.currentUser.instance}/api/v1/statuses/${statusId}`, {
                headers: {
                    Authorization: `Bearer ${userContext.currentUser.token}`,
                },
            });
            setStatuses(() => statuses.filter(status => status.id !== statusId));
            setToast("Deleted Successfully!");
        } catch (error) {
            setError(error.response?.data || "Failed to delete post");
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

    if(!userContext?.currentUser) {
        return null;
    }

    return (
        <div className="main">
            <Navbar />
            <Sidebar />
            <ThemePicker />
            <div className="feed container">
                <Headbar />
                <div className="profile">
                    <div className="header-container">
                        {user.header !== "https://mastodon.social/headers/original/missing.png" && <img className="profileHeader" src={user.header} alt="header" />}
                        {followedBy && <div className="followed-by">Follows you</div>}
                    </div>
                    <div className="profileTop">
                        <div className="profileTopLeft">
                            <img className="profileImg" src={user.avatar} alt="profile" />
                        </div>
                        <div className="profileTopRight">
                            {/* show edit profile button only if the user is the current user */}
                            {userContext.currentUser.id === id ? 
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
                        <span className="profileUserInstance">{user.username === user.acct ? `${user.username}@${userContext.currentUser.instance}` : user.acct}</span>
                    </div>
                    <div className="profileCenter">
                        <div className="profileInfo">
                            <div className="profileInfoItem" style={{cursor: "pointer"}} onClick={() => navigate(`/profile/${user.id || id}`)}>
                                <span className="profileInfoValue">{formatData(user.statuses_count)}</span>
                                <span className="profileInfoKey">Posts</span>
                            </div>
                            <div className="profileInfoItem" style={{cursor: "pointer"}} onClick={() => navigate(`/profile/${user.id || id}/followers`)}>
                                <span className="profileInfoValue">{formatData(user.followers_count)}</span>
                                <span className="profileInfoKey">Followers</span>
                            </div>
                            <div className="profileInfoItem" style={{cursor: "pointer"}} onClick={() => navigate(`/profile/${user.id || id}/following`)}>
                                <span className="profileInfoValue">{formatData(user.following_count)}</span>
                                <span className="profileInfoKey">Following</span>
                            </div>
                        </div>
                        <div className="profileBio">
                            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                        </div>
                    </div>
                    <div className="profileBottom">
                        {loading ? (
                            <div className="loading">Loading...</div>
                        ) : (
                            statuses.map((status) => (
                                <Status key={status.id} post={status} instance={userContext.currentUser.instance} isUserProfile={true} delete={handleDelete} />
                            ))
                        )}
                    </div>
                </div>
            </div>
            <EditProfile show={show} handleClose={handleClose} user={user} />
        </div>
    );
}

export default Profile;

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "../styles/sidebar.css";

function Sidebar() {
    const {currentUser} = useContext(UserContext);
    const [message, setMessage] = useState("");
    let navigate = useNavigate();

    function handleUserClick(){
        navigate(`/profile/${currentUser.id}`);
    }

    async function handleSubmit(event){
        event.preventDefault();
        // console.log(event.target.media.files);
        const files = Array.from(event.target.media.files);
        try {
            const uploadPromises = files.map(file => 
                axios.post(`https://${currentUser.instance}/api/v2/media`, {
                    file,
                }, {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                        "Content-Type": "multipart/form-data",
                    }
                })
            );

            const responses = await Promise.all(uploadPromises);
            const newIds = responses.map(response => response.data.id);
            setTimeout(() => postStatus(newIds), 5000)

        } catch (error) {
            console.log(error)
        }
    }

    async function postStatus(ids){
        console.log(ids);
        try {
            const response = await axios.post("http://localhost:3000/api/v1/statuses", {
                message,
                instance: currentUser.instance,
                token: currentUser.token,
                reply_id: "",
                media_ids: ids,
            });
            setMessage("");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="sidebar">
            <div className="profileTop" onClick={handleUserClick}>
                <div className="profileTopLeft">
                    <img className="statusProfileImg" src={currentUser.avatar} alt="profile" />
                    <div className="user">
                        <span className="statusUsername" onClick={handleUserClick}>{currentUser.name}</span>
                        <span className="userInstance">{`${currentUser.name}@${currentUser.instance}`}</span>
                    </div>
                </div>
            </div>

            <div className="container mt-4">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Post a Status</label>
                        <textarea className="form-control" id="message" rows="3" maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                        {500 - message.length}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="media" className="form-label">Upload Images/Videos</label>
                        <input type="file" id="media" className="form-control" accept="image/*, video/*" multiple />
                    </div>
                    <button type="submit" className="my-button">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Sidebar;
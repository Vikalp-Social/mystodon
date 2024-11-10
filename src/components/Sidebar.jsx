import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import APIClient from "../apis/APIClient";
import { UserContext } from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import "../styles/sidebar.css";
import Reply from "./Reply";
import { FaPenToSquare } from "react-icons/fa6";

// Sidebar component that is present on all pages
function Sidebar() {
    const {currentUser, paths} = useContext(UserContext);
    const {setError, setToast} = useErrors();
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);
    let navigate = useNavigate();

    //navigate to the current user's profile
    function handleUserClick(){
        navigate(`${paths.profile}/${currentUser.id}`);
    }

    //fucntion to upload the media(if any) and post the status
    async function handleSubmit(event){
        event.preventDefault();
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
            setToast("Uploaded media");
            setTimeout(() => postStatus(newIds), 5000)

        } catch (error) {
            setError(error.response.data);;
        }
    }

    //function to post the status
    async function postStatus(ids){
        try {
            const response = await APIClient.post("/statuses", {
                message,
                instance: currentUser.instance,
                token: currentUser.token,
                reply_id: "",
                media_ids: ids,
            });
            setMessage("");
            setToast("Posted!")
        } catch (error) {
            setError(error.response.data);;;
        }
    }

    return (
        <>
            <div className="sidebar">
                <div className="sidebarTop">
                    <div className="sidebarTopLeft">
                        <img src={currentUser.avatar} alt="profile" />
                        <div className="sidebarUser">
                            <span className="statusUsername" onClick={handleUserClick}>{currentUser.name}</span>
                            <span className="userInstance">{`${currentUser.name}@${currentUser.instance}`}</span>
                        </div>
                    </div>
                </div>

                <div className="sidebarCenter">
                    <form encType="multipart/form-data" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">Post a Status</label>
                            <textarea className="form-control" id="message" rows="3" maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                            {/* limiting length of the status to 500 characters */}
                            Remaining Characters: {500 - message.length}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="media" className="form-label">Upload Images/Videos</label>
                            <input type="file" id="media" className="form-control" accept="image/*, video/*" multiple />
                        </div>
                        <button type="submit" className="my-button">Submit</button>
                    </form>
                </div>
            </div>

            <div className="sidebar-button" onClick={() => setShow(true)}>
                <FaPenToSquare />
            </div>
            <Reply show={show} close={() => setShow(false)} />
        </>
        
    );
}

export default Sidebar;
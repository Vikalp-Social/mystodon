import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function Sidebar() {
    const [ids, setIds] = useState([]);

    const {currentUser} = useContext(UserContext);
    const [message, setMessage] = useState("");
    let navigate = useNavigate();

    function handleUserClick(){
        navigate(`/profile/${currentUser.id}`);
    }

    async function handleSubmit(event){
        event.preventDefault();
        //problem with using images and videos in a status: the media file doesnt get 'processed' for some time, and the id shown may not be the correct one
        //wait for a set time before posting the status (30 mins??)
        //refer to https://stackoverflow.com/questions/75331088/how-to-use-the-mastodon-api-to-post-a-status-update-with-an-image

        // console.log(event.target.media.files);
        // const files = Array.from(event.target.media.files);
        // try {
        //     files.map(async (file) => {
        //         const response = await axios.post(`https://${currentUser.instance}/api/v2/media`, {
        //             file,
        //         }, {
        //             headers: {
        //                 Authorization: `Bearer ${currentUser.token}`,
        //                 "Content-Type": "multipart/form-data",
        //             }
        //         });
        //         setIds( (prev) => [...prev, response.data.id]);
        //     });
            
        //     const response = await axios.post("http://localhost:3000/api/v1/statuses", {
        //         message,
        //         instance: currentUser.instance,
        //         token: currentUser.token,
        //     });
        //     setMessage("");
        // } catch (error) {
        //     console.log(error)
        // }
        try {
            const response = await axios.post("http://localhost:3000/api/v1/statuses", {
                message,
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setMessage("");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="sidebar">
            <div className="profileTop">
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
                        <textarea className="form-control" id="message" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="media" className="form-label">Upload Images/Videos</label>
                        <input type="file" id="media" className="form-control" accept="image/*, video/*" multiple />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
//{user.account.username === user.account.acct ? `${user.account.username}@${currentUser.instance}` : user.account.acct}
export default Sidebar;
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function Sidebar() {
    const {currentUser} = useContext(UserContext);
    const [message, setMessage] = useState("");
    let navigate = useNavigate();

    function handleUserClick(){
        navigate(`/profile/${currentUser.id}`);
    }

    async function handleSubmit(event){
        event.preventDefault();
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
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                    <label htmlFor="message" className="form-label">Post a Status</label>
                    <textarea className="form-control" id="message" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
//{user.account.username === user.account.acct ? `${user.account.username}@${currentUser.instance}` : user.account.acct}
export default Sidebar;
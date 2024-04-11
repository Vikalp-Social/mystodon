import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { UserContext } from "../context/UserContext";
import MediaDisplay from "./MediaDisplay";

function Status(props) {
    const {currentUser} = useContext(UserContext);
    const sanitizedHtml = DOMPurify.sanitize(props.post.content);
    const [isEditing, setEditing] = useState(false);
    const [text, setText] = useState(sanitizedHtml);
    let navigate = useNavigate();

    useEffect(() => {
        const regex = /(<([^>]+)>)/gi;
        const newString = text.replace(regex, " ");
        setText(newString);
    }, []);

    function handleUserClick(id){
        navigate(`/profile/${id}`)
    }

    function handleEdit(){
        setEditing(true);
    }

    function handleBlur(){
        setEditing(false);
    }

    async function handleSubmit(event){
        event.preventDefault();
        setEditing(false);
        try {
            const response = await axios.put(`http://localhost:3000/api/v1/statuses/${props.post.id}`, {
                instance: currentUser.instance,
                token: currentUser.token,
                text,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDelete() {
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/statuses/${props.post.id}`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="status">
            {props.reblogged && <span className="statusUsername" onClick={() => handleUserClick(props.postedBy.id)}>Reblogged by: {props.postedBy.username}</span>}
            <div className="statusTop">
                <div className="statusTopLeft">
                    <img className="statusProfileImg" src={props.post.account.avatar} alt="profile" />
                    <div className="user">
                        <span className="statusUsername" onClick={() => handleUserClick(props.post.account.id)}>{props.post.account.username}</span>
                        <span className="userInstance">{props.post.account.username === props.post.account.acct ?`${props.post.account.username}@${props.instance}` : props.post.account.acct}</span>
                    </div>
                </div>
                <div className="postTopRight">
                    {props.isUserProfile && 
                    <div>
                    <button type="button" class="btn btn-outline-secondary" onClick={handleEdit}>Edit</button>
                    <button type="button" class="btn btn-outline-danger" onClick={handleDelete}>Delete</button>
                    </div>}
                </div>
            </div>
            <div className="statusCenter">
                {isEditing ? 
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="form-control"
                            id="status"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onBlur={handleBlur}
                            autoFocus
                            />
                        <button type="submit" className="btn btn-primary" onMouseDown={(e) => e.preventDefault()}>Save Changes</button> 
                    </form>
                :
                <span className="statusText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
                }
                {props.post.media_attachments.length ? <MediaDisplay mediaList={props.post.media_attachments}/> : ""}
            </div>
        </div>
    );
}

export default Status;
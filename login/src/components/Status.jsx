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
    const [isReplying, setReplying] = useState(false);
    const [text, setText] = useState(sanitizedHtml);
    const [replyText, setReplyText] = useState(`@${props.post.account.acct} `);
    const [isFavourite, setFavourite] = useState(props.post.favourited);
    const [isBoosted, setBoosted] = useState(props.post.reblogged);
    let navigate = useNavigate();

    useEffect(() => {
        const regex = /(<([^>]+)>)/gi;
        const newString = text.replace(regex, " ");
        setText(newString);
    }, [text, props]);

    function handleClick(){
        navigate(`/status/${props.post.in_reply_to_id ? props.post.in_reply_to_id : props.post.id}`);
    }

    function handleUserClick(event, id){
        event.stopPropagation();
        navigate(`/profile/${id}`)
    }

    function handleEdit(event){
        event.stopPropagation();
        setEditing(true);
    }

    function handleEditBlur(event){
        event.stopPropagation();
        setEditing(false);
    }

    async function handleSubmit(event){
        event.preventDefault();
        event.stopPropagation();
        setEditing(false);
        try {
            const response = await axios.put(`https://${currentUser.instance}/api/v1/statuses/${props.post.id}`, {status: text}, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDelete(event) {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await axios.delete(`https://${currentUser.instance}/api/v1/statuses/${props.post.id}`, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleFavourite(event){
        event.preventDefault();
        event.stopPropagation();
        try {
            let prefix = props.post.favourited ? "un" : "";
            const response = await axios.post(`http://localhost:3000/api/v1/statuses/${props.post.id}/favourite`, {
                instance: currentUser.instance,
                token: currentUser.token,
                prefix: prefix,
            });
            //console.log(response.data);
            setFavourite(prev => !prev);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleBoost(event){  
        event.preventDefault();
        event.stopPropagation();
        try {
            let prefix = props.post.reblogged ? "un" : "";
            const response = await axios.post(`http://localhost:3000/api/v1/statuses/${props.post.id}/boost`, {
                instance: currentUser.instance,
                token: currentUser.token,
                prefix: prefix,
            });
            console.log(response.data);
            setBoosted(prev => !prev);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleReply(event){
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await axios.post("http://localhost:3000/api/v1/statuses", {
                message: replyText,
                instance: currentUser.instance,
                token: currentUser.token,
                reply_id: props.post.id,
            });
            setReplying(false);
            navigate(`/status/${props.post.id}`);
        } catch (error) {
            console.log(error);
        }
        
    }

    return(
        <>
            <div className="status" onClick={handleClick}>
                {props.reblogged && <span className="statusUsername" onClick={(event) => handleUserClick(event, props.postedBy.id)}>Reblogged by: {props.postedBy.username}</span>}
                <div className="statusTop">
                    <div className="statusTopLeft">
                        <img className="statusProfileImg" src={props.post.account.avatar} alt="profile" />
                        <div className="user">
                            <span className="statusUsername" onClick={(event) => handleUserClick(event, props.post.account.id)}>{props.post.account.username}</span>
                            <span className="userInstance">{props.post.account.username === props.post.account.acct ?`${props.post.account.username}@${props.instance}` : props.post.account.acct}</span>
                        </div>
                    </div>
                    <div className="postTopRight">
                        {props.isUserProfile && !props.reblogged &&
                        <div>
                        <button type="button" class="btn btn-outline-secondary" onClick={handleEdit}>Edit</button>
                        <button type="button" class="btn btn-outline-danger" onClick={handleDelete}>Delete</button>
                        </div>}
                    </div>
                </div>
                <div className="statusCenter">
                    {isEditing ? 
                        <form >
                            <input
                                type="text" className="form-control" id="status"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onBlur={handleEditBlur}
                                autoFocus
                                />
                            <button type="submit" className="btn btn-primary" onMouseDown={(e) => handleSubmit(e)}>Save Changes</button> 
                        </form>
                    :
                    <span className="statusText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
                    }
                    {props.post.media_attachments.length ? <MediaDisplay mediaList={props.post.media_attachments}/> : ""}
                </div>
                <div className="statusBottom">
                    <div className="statusBottomLeft">
                        <button type="button" class="btn btn-outline-secondary" onClick={handleFavourite}>{isFavourite ? "Unfavourite" : "Favourite"}</button>
                        <button type="button" class="btn btn-outline-secondary" onClick={handleBoost}>{isBoosted ? "Unboost" : "Boost"}</button>
                        <button type="button" class="btn btn-outline-secondary" onClick={(e) => {
                            e.stopPropagation() 
                            setReplying(true)
                        }}>Reply</button>
                    </div>
                </div>
            </div>
                {isReplying ? 
                    <div style={{marginBottom: "10px"}}>
                        <form >
                            <input
                                type="text" className="form-control" id="status"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                autoFocus
                                />
                            <button type="submit" className="btn btn-primary" onClick={handleReply}>reply</button> 
                            <button type="button" className="btn btn-danger" onClick={() => setReplying(false)}>cancel</button> 
                        </form>
                    </div>
                : 
                    ""
                }
        </>
    );
}

export default Status;
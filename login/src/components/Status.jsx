import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { UserContext } from "../context/UserContext";
import MediaDisplay from "./MediaDisplay";
import { FaRegComment , FaHeart , FaRegHeart ,FaRepeat, FaShare } from "react-icons/fa6";
import { MdOutlineModeEdit, MdDeleteOutline, MdOutlineRepeat } from "react-icons/md";
import "../styles/status.css";

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
        if(!props.reply){
            navigate(`/status/${props.post.in_reply_to_id ? props.post.in_reply_to_id : props.post.id}`);
        }
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
            setFavourite(prev => {
                props.post.favourites_count = !prev ? props.post.favourites_count + 1 : props.post.favourites_count - 1;
                return !prev;
            });
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

    function handleShare(event){
        event.preventDefault();
        event.stopPropagation();
        navigator.clipboard.writeText(props.post.uri);
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

    return(
        <>
            <div className={props.reply ? "reply" : "status"} onClick={handleClick} >
                {props.reblogged && <div className="statusRepost" onClick={(event) => handleUserClick(event, props.postedBy.id)}>
                    <MdOutlineRepeat style={{color: "green", fontSize: "20px"}}/> <span><strong>{props.postedBy.display_name}</strong></span> reposted
                </div>}
                <div className="statusTop">
                    <div className="statusTopLeft">
                        <img className="statusProfileImg" src={props.post.account.avatar} alt="profile" />
                        <div className="user">
                            <span className="statusUsername" onClick={(event) => handleUserClick(event, props.post.account.id)}>{props.post.account.display_name}</span>
                            <span className="userInstance">{props.post.account.username === props.post.account.acct ?`${props.post.account.username}@${props.instance}` : props.post.account.acct}</span>
                        </div>
                    </div>
                    {props.isUserProfile && !props.reblogged &&
                    <div className="statusTopRight">
                        <div onClick={handleEdit}><MdOutlineModeEdit style={{color: "grey"}}/></div>
                        <div onClick={handleDelete}><MdDeleteOutline style={{color: "rgb(127,29,29)"}}/></div>
                    </div>}
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
                        <div title="Reply" onClick={(e) => {e.stopPropagation(); setReplying(true)}}> <FaRegComment/> 
                            <span className="stats">{formatData(props.post.replies_count)}</span> 
                        </div>
                        <div title="Repost" onClick={handleBoost}><FaRepeat style={{color: isBoosted ? "green" : ""}} /> 
                            <span className="stats">{formatData(props.post.reblogs_count)}</span>
                        </div>
                        <div title="Like" onClick={handleFavourite}> {isFavourite ? <FaHeart /> : <FaRegHeart />} 
                            <span className="stats">{formatData(props.post.favourites_count)}</span>
                        </div>
                        <div title="Share" onClick={handleShare}> <FaShare/> </div>
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
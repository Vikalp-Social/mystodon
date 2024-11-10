import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import APIClient from "../apis/APIClient";
import DOMPurify from "dompurify";
import { UserContext } from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import MediaDisplay from "./MediaDisplay";
import "../styles/status.css";
import Reply from "./Reply";
import EditStatus from "./EditStatus";
import ShareModal from "./ShareModal";
import { FaRegComment , FaHeart , FaRegHeart ,FaRepeat, FaShare } from "react-icons/fa6";
import { MdOutlineModeEdit, MdDeleteOutline, MdOutlineRepeat } from "react-icons/md";
import UsernameEmoji from "./UsernameEmoji";

// Status component is used to display the status of the user
function Status(props) {
    const {currentUser, paths} = useContext(UserContext);
    const { setError } = useErrors()
    const sanitizedHtml = DOMPurify.sanitize(props.post.content);
    const [isEditing, setEditing] = useState(false);
    const [isReplying, setReplying] = useState(false);
    const [share, setShare] = useState(false);
    const [text, setText] = useState(sanitizedHtml);
    const [isFavourite, setFavourite] = useState(props.post.favourited);
    const [isBoosted, setBoosted] = useState(props.post.reblogged);
    let navigate = useNavigate();

    useEffect(() => {
        //regular expression to remove the html tags from the text
        const regex = /(<([^>]+)>)/gi;
        const newString = text.replace(regex, " ");
        setText(newString);
    }, [text, props]);

    //navigate to the status when clicked
    function handleClick(){
        if(!props.reply){
            //navigate to the the parent status if the status is a reply
            navigate(`${paths.status}/${props.post.in_reply_to_id ? props.post.in_reply_to_id : props.post.id}`);
        }
    }

    //navigate to the user's profile when username is clicked
    function handleUserClick(event, id){
        event.stopPropagation();
        navigate(`${paths.profile}/${id}`)
    }

    //function to show the edit status component
    function handleEdit(event){
        event.stopPropagation();
        setEditing(true);
    }

    //function to handle the favourite button
    async function handleFavourite(event){
        event.preventDefault();
        event.stopPropagation();
        try {
            let prefix = props.post.favourited ? "un" : "";
            const response = await APIClient.post(`/statuses/${props.post.id}/favourite`, {
                instance: currentUser.instance,
                token: currentUser.token,
                prefix: prefix,
            });
            setFavourite(prev => {
                props.post.favourites_count = !prev ? props.post.favourites_count + 1 : props.post.favourites_count - 1;
                return !prev;
            });
        } catch (error) {
            setError(error.response.data);
        }
    }

    //function to handle the repost/boost button
    async function handleBoost(event){  
        event.preventDefault();
        event.stopPropagation();
        try {
            let prefix = props.post.reblogged ? "un" : "";
            const response = await APIClient.post(`/statuses/${props.post.id}/boost`, {
                instance: currentUser.instance,
                token: currentUser.token,
                prefix: prefix,
            });
            setBoosted(prev => !prev);
        } catch (error) {
            setError(error.response.data);
        }
    }

    //function to handle the share button and display the ShareModal component corresponding to the status
    function handleShare(event){
        event.preventDefault();
        event.stopPropagation();
        navigator.clipboard.writeText(props.post.uri);
        setShare(true);
    }

    //function to format the data to be displayed
    function formatData(data){
        let message = data;
        if(data > 1000){
            message = `${(data/1000).toFixed(2)}k`;
            data = data/1000;
            if(data > 100) message = `${Math.round(data)}k`;
        }
        return message; 
    }

    function formatTime(time){
        let date = new Date(time);
        //format to month day year, hours:minutes AM/PM
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    }

    return(
        <>
            <div className={props.reply ? "reply" : "status"} onClick={handleClick} style={{paddingBottom: (props.reply && props.thread) ? '0' : '10px'}}>
                {props.reblogged && <div className="statusRepost" onClick={(event) => handleUserClick(event, props.postedBy.id)}>
                    <MdOutlineRepeat style={{color: "green", fontSize: "20px"}}/> <span><strong><UsernameEmoji name={props.postedBy.display_name || props.postedBy.username} emojis={props.postedBy.emojis} /></strong></span> <span>reposted</span>
                </div>}
                <div className="statusTop">
                    <div className="statusTopLeft">
                        <img className="statusProfileImg" src={props.post.account.avatar} alt="profile" onClick={(event) => handleUserClick(event, props.postedBy.id)}/>
                        <div className="statusUser">
                            <span className="statusUsername" onClick={(event) => handleUserClick(event, props.post.account.id)}><UsernameEmoji name={props.post.account.display_name || props.post.account.username} emojis={props.post.account.emojis} /></span>
                            <span className="userInstance">{props.post.account.username === props.post.account.acct ?`${props.post.account.username}@${props.instance}` : props.post.account.acct}</span>
                        </div>
                    </div>
                    {props.isUserProfile && !props.reblogged &&
                    <div className="statusTopRight">
                        <div onClick={handleEdit}><MdOutlineModeEdit style={{color: "grey"}}/></div>
                        <div onClick={(e) => props.delete(e, props.post.id)}><MdDeleteOutline style={{color: "rgb(127,29,29)"}}/></div>
                    </div>}
                </div>
                <div className={props.thread ? "statusCenter" : ""}>
                    {/* this is to display the "thread" if the status is a reply and part of a thread  */}
                    {(props.reply && props.thread) && <div className="reply-line-container"><div className="reply-line"></div></div>}
                    <div className="statusBody">
                        <span className="statusText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
                        {props.post.media_attachments.length ? <MediaDisplay mediaList={props.post.media_attachments}/> : <div></div>}
                        
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
                                <div title="Share" onClick={handleShare}> 
                                    <FaShare/>
                                </div>
                            </div>

                            <div className="statusBottomRight">
                                <span>{formatTime(props.post.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Reply Component to reply to the post*/}
            <Reply 
                show={isReplying} 
                close={() => setReplying(false)} 
                instance={props.instance}
                post={props.post}
                mentions={props.mentions}
            /> 
            {/* EditStatus Component to edit the post*/}
            <EditStatus
                show={isEditing} 
                close={() => setEditing(false)} 
                content={props.post.content}
                id={props.post.id}
            /> 
            {/* ShareModal Component to share the post*/}
            <ShareModal show={share} close={() => setShare(false)} link={props.post.uri}/>
        </>
    );
}

export default Status;
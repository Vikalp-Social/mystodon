import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { UserContext } from "../context/UserContext";

function Status(props) {
    const {currentUser} = useContext(UserContext);
    const sanitizedHtml = DOMPurify.sanitize(props.body);
    const [isEditing, setEditing] = useState(false);
    const [text, setText] = useState(sanitizedHtml);
    let navigate = useNavigate();

    useEffect(() => {
        const regex = /(<([^>]+)>)/gi;
        const newString = text.replace(regex, " ");
        setText(newString);
    }, []);

    function handleUserClick(){
        navigate(`/profile/${props.user_id}`)
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
            const response = await axios.put(`http://localhost:3000/api/v1/statuses/${props.id}`, {
                instance: currentUser.instance,
                token: currentUser.token,
                text,
            });
        } catch (error) {
            console.log(error);
        }
        console.log("submitted");
    }

    return(
        <div className="status">
            <div className="statusTop">
                <div className="statusTopLeft">
                    <img className="statusProfileImg" src={props.prof} alt="profile" />
                    <div className="user">
                        <span className="statusUsername" onClick={handleUserClick}>{props.name}</span>
                        <span className="userInstance">{props.name === props.fullname ?`${props.name}@${props.instance}` : props.fullname}</span>
                    </div>
                </div>
                <div className="postTopRight">
                    {props.isUserProfile && <button type="button" class="btn btn-outline-secondary" onClick={handleEdit}>Edit</button>}
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

                {props.src.type === "gifv" || props.src.type === "video" ? 
                <video controls preload className="statusMedia">
                    <source src={props.src.url} type="video/mp4"/>
                </video>
                :
                <img className="statusMedia" src={props.src.url} alt="" />
                }
            </div>
        </div>
    );
}

export default Status;
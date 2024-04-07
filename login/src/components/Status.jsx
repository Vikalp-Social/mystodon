import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

function Status(props) {
    const sanitizedHtml = DOMPurify.sanitize(props.body);
    let navigate = useNavigate();

    function handleUserClick(){
        navigate(`/profile/${props.user_id}`)
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
            </div>
            <div className="statusCenter">
                <span className="statusText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
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
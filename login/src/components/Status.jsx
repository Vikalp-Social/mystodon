import DOMPurify from "dompurify";

function Status(props) {
    const sanitizedHtml = DOMPurify.sanitize(props.body);

    function handleClick() {
        console.log(props.id);
    }

    return(
        <div className="status" onClick={handleClick}>
            <div className="statusTop">
                <div className="statusTopLeft">
                    <img className="statusProfileImg" src={props.prof} alt="profile picture" />
                    <div className="user">
                        <span className="statusUsername">{props.name}</span>
                        <span className="userInstance">{props.name === props.fullname ?`${props.name}@${props.instance}` : props.fullname}</span>
                    </div>
                </div>
            </div>
            <div className="statusCenter">
                <span className="statusText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
                <img className="statusImg" src={props.img} alt="" />
            </div>
        </div>
    );
}

export default Status;
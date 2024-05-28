import React, { useState, useEffect } from 'react'
import DOMPurify from "dompurify";

function MiniStatus(props) {
    const sanitizedHtml = DOMPurify.sanitize(props.post.content);
	const [text, setText] = useState(sanitizedHtml);

	useEffect(() => {
        const regex = /(<([^>]+)>)/gi;
        const newString = text.replace(regex, " ");
        setText(newString);
    }, [text, props]);


	return (
		<>
			<div className="mini-status">
				<div className="statusTop">
					<div className="statusTopLeft">
						<img className="statusProfileImg" src={props.post.account.avatar} alt="profile" />
						<div className="statusUser">
							<span className="statusUsername">{props.post.account.display_name}</span>
							<span className="userInstance">{props.post.account.username === props.post.account.acct ?`${props.post.account.username}@${props.instance}` : props.post.account.acct}</span>
						</div>
					</div>
				</div>
				<div className="statusCenter">
					<span className="statusText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
					{/* {props.post.media_attachments.length ? <MediaDisplay mediaList={props.post.media_attachments}/> : <div></div>} */}
				</div>
			</div>
		</>
	)
}

export default MiniStatus
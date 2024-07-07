import React, { useState, useEffect } from 'react'
import DOMPurify from "dompurify";
import UsernameEmoji from "./UsernameEmoji";

// MiniStatus component is used to display a status in a minimized form in the Reply component
function MiniStatus(props) {
    const sanitizedHtml = DOMPurify.sanitize(props.post.content);
	const [text, setText] = useState(sanitizedHtml);

	//regular expression to remove the html tags from the text
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
							<span className="statusUsername"><UsernameEmoji name={props.post.account.display_name} emojis={props.post.account.emojis} /></span>
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
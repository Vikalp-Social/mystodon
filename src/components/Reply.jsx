import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APIClient from '../apis/APIClient';
import MiniStatus from './MiniStatus';
import Modal from 'react-bootstrap/Modal';
import { UserContext } from '../context/UserContext';
import { useErrors } from '../context/ErrorContext';
import "../styles/reply.css";

// Reply component is the modal which appears when the user wants to reply to a post
function Reply(props){
    const {currentUser, paths} = useContext(UserContext);
    const {setError} = useErrors();
    
    //to initialize the reply text with the username of all the users to whom the reply is being made
    const [replyText, setReplyText] = useState(() => {
        let str = "";
        if(props.post){
            str = `@${props.post.account.acct} `;
            props.mentions && props.mentions.map((mention) => {
                if(mention.acct !== currentUser.username){
                    str += `@${mention.acct} `;
                }
            })
        }
        return str;
    });
    let navigate = useNavigate();

    //function to post the reply
    async function handleReply(event){
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await APIClient.post("statuses", {
                message: replyText,
                instance: currentUser.instance,
                token: currentUser.token,
                reply_id: props.post ? props.post.id : "",
            });
            props.close();
            
            if(props.post){
                navigate(`${paths.status}/${props.post.id}`);
            }
            
        } catch (error) {
            setError(error.response.data);
        }
    }

    return(
        <Modal show={props.show} onHide={props.close} dialogClassName='reply-modal' contentClassName='reply-modal-content' centered>
            <Modal.Header closeButton closeVariant={localStorage.getItem("selectedTheme") === "dark" ? "white" : "black"}>
                <Modal.Title id="example-modal-sizes-title-lg">{props.post ? "Reply to Post" : "Post a Status"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='reply-body'>
                    {props.post && <MiniStatus 
                        instance={props.instance}
                        post={props.post}
                    />}
                    <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={5}
                        autoFocus
                        onFocus={(e) => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
                        maxLength={500}
                    />
                    <div className='reply-bottom'>
                        <span>Remaining: {500 - replyText.length}</span>
                        <button className='my-button' onClick={handleReply} style={{margin:"5px 0 0 10px"}}>
                            POST
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default Reply;
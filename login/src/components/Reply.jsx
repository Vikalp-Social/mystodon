import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MiniStatus from './MiniStatus';
import Modal from 'react-bootstrap/Modal';
import { UserContext } from '../context/UserContext';
import "../styles/reply.css";

function Reply(props){
    const {currentUser} = useContext(UserContext);
    const [replyText, setReplyText] = useState(() => {
        let str = `@${props.post.account.acct} `;
        props.mentions && props.mentions.map((mention) => {
            if(mention.acct !== currentUser.username){
                str += `@${mention.acct} `;
            }
        })
        return str;
    });
    let navigate = useNavigate();

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
            props.close();
            navigate(`/status/${props.post.id}`);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <Modal show={props.show} onHide={props.close} dialogClassName='reply-modal' contentClassName='reply-modal-content' centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">Reply to Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <MiniStatus 
                    instance={props.instance}
                    post={props.post}
                />
                <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={5}
                />
                <button className='btn btn-primary' onClick={handleReply}>POST</button>
            </Modal.Body>
        </Modal>
    )
}

export default Reply;
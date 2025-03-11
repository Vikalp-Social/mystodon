import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APIClient from '../apis/APIClient';
import Modal from 'react-bootstrap/Modal';
import { UserContext } from '../context/UserContext';
import { useErrors } from '../context/ErrorContext';
import "../styles/reply.css";

import axios from 'axios';

// Reply component is the modal which appears when the user wants to reply to a post
function CreateList(props){
    const {currentUser, paths} = useContext(UserContext);
    const {setError} = useErrors();
    const [replyText, setReplyText] = useState("");
    
    let navigate = useNavigate();

    //function to post the reply
    async function createList(event){
        event.preventDefault();
        event.stopPropagation();
        try {
            if(props.type == "public"){
                const response = await axios.post("https://auth.srg.social/api/v1/lists/public", {
                    title: replyText,
                },
                {params: {
                        instance: currentUser.instance,
                        user: currentUser.name || currentUser.username,
                        token: currentUser.token,
                    }
                });
            }
            else if(props.type == "private"){
                const response = await APIClient.post("/lists", {
                    title: replyText,
                },
                {params: {
                        instance: currentUser.instance,
                        user: currentUser.name || currentUser.username,
                    }
                });
            }
            console.log("created");
            setReplyText("");
            props.close();
        } catch (error) {
            setError(error.response.data);
        }
    }

    return(
        <Modal show={props.show} onHide={props.close} dialogClassName='reply-modal' contentClassName='reply-modal-content' centered>
            <Modal.Header closeButton closeVariant={localStorage.getItem("selectedTheme") === "dark" ? "white" : "black"}>
                <Modal.Title id="example-modal-sizes-title-lg">Create a {(props.type).toUpperCase()} List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='reply-body'>
                    <input 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                        onFocus={(e) => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
                    />
                    <div className='reply-bottom'>
                        <button className='my-button' onClick={createList} style={{margin:"5px 0 0 10px"}}>
                            CREATE
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default CreateList;
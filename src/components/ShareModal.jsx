import React from 'react'
import { Modal } from 'react-bootstrap'
import { FacebookShareButton, FacebookIcon, TwitterShareButton, XIcon, TelegramShareButton, TelegramIcon, WhatsappShareButton, WhatsappIcon, RedditShareButton, RedditIcon } from "react-share";
import "../styles/reply.css";
import { useErrors } from '../context/ErrorContext';

//Component to display the share modal
function ShareModal(props) {
    const {setToast} = useErrors();
    const size = 50;

    return (
        <Modal show={props.show} onHide={props.close} dialogClassName='reply-modal' contentClassName='reply-modal-content' centered>
                <Modal.Header closeButton closeVariant={localStorage.getItem("selectedTheme") === "dark" ? "white" : "black"}>
                    <Modal.Title id="example-modal-sizes-title-lg">Share Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='share-body'>
                        <div class="input-group mb-3">
                            <input type="text" className='form-control' value={props.link} readOnly/>
                            <button class="my-button" type="button" id="button-addon2" onClick={() => {navigator.clipboard.writeText(props.link);setToast("Copied!")}}>Copy</button>
                        </div>
                        {/* using react-share library to share the post on different platforms */}
                        <div className='share-buttons'>
                            <FacebookShareButton url={props.link}> <FacebookIcon size={size} round></FacebookIcon></FacebookShareButton>
                            <TwitterShareButton url={props.link}> <XIcon size={size} round></XIcon></TwitterShareButton>
                            <TelegramShareButton url={props.link}> <TelegramIcon size={size} round></TelegramIcon></TelegramShareButton>
                            <WhatsappShareButton url={props.link}> <WhatsappIcon size={size} round></WhatsappIcon></WhatsappShareButton>
                            <RedditShareButton url={props.link}> <RedditIcon size={size} round></RedditIcon></RedditShareButton>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
    )
}

export default ShareModal
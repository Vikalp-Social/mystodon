import { useContext, useState, useEffect } from 'react'
import APIClient from '../apis/APIClient';
import { UserContext } from '../context/UserContext'
import { useErrors } from '../context/ErrorContext'
import { Modal } from 'react-bootstrap'

function EditStatus(props) {
    const {currentUser} = useContext(UserContext);
    const {setError, setToast} = useErrors();
    const [statusText, setStatusText] = useState(props.content);

    useEffect(() => {
        // Regular expression to remove HTML tags from text
        const regex = /(<([^>]+)>)/gi;
        const newString = statusText.replace(regex, " ");
        setStatusText(newString);
    }, [statusText, props]);

    //function to handle the submit of the form and edit the status
    async function handleEdit(event){
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await APIClient.put(`/statuses/${props.id}`, {instance: currentUser.instance, token: currentUser.token, text: statusText});
            props.close();
        } catch (error) {
            setError(error.response.data);
        }
    }

    return (
        <Modal show={props.show} onHide={props.close} dialogClassName='reply-modal' contentClassName='reply-modal-content' centered>
                <Modal.Header closeButton closeVariant={localStorage.getItem("selectedTheme") === "dark" ? "white" : "black"}>
                    <Modal.Title id="example-modal-sizes-title-lg">Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='reply-body'>
                        <textarea 
                            value={statusText}
                            onChange={(e) => setStatusText(e.target.value)}
                            rows={5}
                            autoFocus
                            onFocus={(e) => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
                            maxLength={500}
                        />
                        <div className='reply-bottom'>
                            <span>Remaining: {500 - statusText.length}</span>
                            <button className='my-button' onClick={handleEdit} style={{margin:"5px 0 0 10px"}}>POST</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
    )
}

export default EditStatus
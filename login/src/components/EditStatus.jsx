import { useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { UserContext } from '../context/UserContext'
import { useErrors } from '../context/ErrorContext'
import { Modal } from 'react-bootstrap'

function EditStatus(props) {
    const {currentUser} = useContext(UserContext);
    const {setError, setToast} = useErrors();
    const [statusText, setStatusText] = useState(props.content);

    useEffect(() => {
        const regex = /(<([^>]+)>)/gi;
        const newString = statusText.replace(regex, " ");
        setStatusText(newString);
    }, [statusText, props]);

    async function handleEdit(event){
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await axios.put(`https://${currentUser.instance}/api/v1/statuses/${props.id}`, {status: statusText}, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
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
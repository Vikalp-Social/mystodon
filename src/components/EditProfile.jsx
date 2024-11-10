import { useContext, useState, useEffect } from 'react';
import APIClient from '../apis/APIClient';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { UserContext } from '../context/UserContext';
import { useErrors } from '../context/ErrorContext';
import "../styles/profile.css";

function EditProfile(props){
    const {currentUser} = useContext(UserContext);
    const {setError} = useErrors();
    const [displayName, setDisplayName] = useState(props.display_name);
    const [note, setNote] = useState(props.note);

    useEffect(() => {
        // Regular expression to remove HTML tags from note
        const regex = /(<([^>]+)>)/gi;
        const newString = props.note.replace(regex, " ");
        setNote(newString);
    }, []);

    //function to handle the submit of the form and edit the profile
    async function handleSubmit() {
        try {
            const response = await APIClient.patch("/accounts", {
                instance: currentUser.instance,
                token: currentUser.token,
                display_name: displayName,
                note: note, 
            });
        } catch (error) {
            setError(error.response.data);
        }
    }

    return(
        <Modal show={props.show} onHide={props.close} contentClassName='editProfile'>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form onSubmit={handleSubmit} className="container mt-4">
                <div className="mb-3">
                    <label htmlFor="displayName" className="form-label">Display Name:</label>
                    <input
                    type="text"
                    className="form-control"
                    id="displayName" 
                    // this is so that the display name is displayed in the input field even if it hasnt been updated in the display_name hook
                    value={displayName || props.display_name}
                    onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="note" className="form-label">Note:</label>
                    <textarea
                    className="form-control"
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    />
                </div>
                <Button variant="secondary" onClick={props.close}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit} onMouseUp={props.close}>
                    Save Changes
                </Button>
            </form>
            </Modal.Body>
        </Modal>
    )
}

export default EditProfile;
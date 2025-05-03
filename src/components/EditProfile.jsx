import { useContext, useState, useEffect } from 'react';
import APIClient from '../apis/APIClient';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { UserContext } from '../context/UserContext';
import { useErrors } from '../context/ErrorContext';
import "../styles/profile.css";

function EditProfile({ show, handleClose, user }){
    const userContext = useContext(UserContext);
    const { setError } = useErrors();
    const [displayName, setDisplayName] = useState(user?.display_name || '');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (user?.note) {
            // Regular expression to remove HTML tags from note
            const regex = /(<([^>]+)>)/gi;
            const newString = user.note.replace(regex, " ");
            setNote(newString);
        }
    }, [user]);

    //function to handle the submit of the form and edit the profile
    async function handleSubmit() {
        if (!userContext?.currentUser) return;
        
        try {
            const response = await APIClient.patch("/accounts", {
                instance: userContext.currentUser.instance,
                display_name: displayName,
                note: note, 
            });
            handleClose();
        } catch (error) {
            setError(error.response.data);
        }
    }

    return(
        <Modal show={show} onHide={handleClose} contentClassName='editProfile'>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="container mt-4">
                <div className="mb-3">
                    <label htmlFor="displayName" className="form-label">Display Name:</label>
                    <input
                    type="text"
                    className="form-control"
                    id="displayName" 
                    value={displayName}
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
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </form>
            </Modal.Body>
        </Modal>
    )
}

export default EditProfile;
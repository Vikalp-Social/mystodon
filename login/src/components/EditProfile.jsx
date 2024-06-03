import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
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
        const regex = /(<([^>]+)>)/gi;
        const newString = props.note.replace(regex, " ");
        setNote(newString);
    }, [note, props]);

    async function handleSubmit() {
        try {
            const response = await axios.put("http://localhost:3000/api/v1/accounts", {
                instance: currentUser.instance,
                token: currentUser.token,
                display_name: displayName,
                note, 
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
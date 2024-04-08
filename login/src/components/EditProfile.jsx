import { useContext, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { UserContext } from '../context/UserContext';

function EditProfile(props){
    const {currentUser} = useContext(UserContext);
    const [displayName, setDisplayName] = useState(props.display_name);
    const [note, setNote] = useState(props.note);
    const [avatar, setAvatar] = useState(props.avatar);

    async function handleSubmit() {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/accounts/edit", {
                instance: currentUser.instance,
                token: currentUser.token,
                display_name: displayName,
                note, 
            });
            console.log("success");
            props.close()
        } catch (error) {
            console.log(error);
        }
        ;
    }

    // const handleAvatarChange = (event) => {
    //     const file = event.target.files[0];
    //     console.log(file);
    //     setAvatar(file);
    //   };

    return(
        <Modal show={props.show} onHide={props.close}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form onSubmit={handleSubmit} className="container mt-4">
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
                {/* <div className="mb-3">
                    <label htmlFor="avatar" className="form-label">Avatar:</label>
                    <input
                    type="file"
                    className="form-control"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    />
                </div> */}
                <Button variant="secondary" onClick={props.close}>
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
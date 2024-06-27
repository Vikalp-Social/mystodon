import React, { useState, useContext, createContext, useEffect } from 'react'
import { Modal, Button, Toast, ToastContainer } from 'react-bootstrap';
import { handleLogOut } from '../components/Navbar';
import { UserContext } from './UserContext';

const ErrorContext = createContext()

export function ErrorProvider({children}) {
    const {setLoggedIn} = useContext(UserContext);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const messages = {
        401: 'Try logging in again',
        404: 'Does not exist',
        410: 'Account is suspended',
        422: 'Invalid data provided',
        500: 'Internal Server Error',
        502: 'Check your internet connection',
    }

    useEffect(() => {
        setTimeout(() => setToast(''), 7000);
    })

    return (
        <ErrorContext.Provider value={{setError, setToast}}>
            {children}

            <Modal show={error !== ''} onClose={() => setError('')} size='tiny'>
                <Modal.Header closeButton>{error.statusText} ({error.status})</Modal.Header>
                <Modal.Body>
                <p>
                {error.error}
                </p>
                <hr />
                <p>{messages[error.status]}</p>
                </Modal.Body>
                <Modal.Footer>
                    {(error.status === 401) || (error.status === 404) ? <Button onClick={() => {setError(''); setLoggedIn(false); handleLogOut()}}>Logout</Button>
                     : <Button onClick={() => {setError(''); window.location.pathname = "/home"}}>Close</Button>

                    }
                </Modal.Footer>
            </Modal>

            <ToastContainer className='p-3' position='bottom-start'>
                <Toast show={toast !== ''} onClose={() => setToast('')} delay={5000}>
                    <Toast.Header></Toast.Header>
                    <Toast.Body>{toast}</Toast.Body>
                </Toast>
            </ToastContainer>
            
        </ErrorContext.Provider>
    );
};

export function useErrors() {
    return useContext(ErrorContext);
}

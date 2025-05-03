import React, { useState, useContext, createContext, useEffect } from 'react'
import { Modal, Button, Toast, ToastContainer } from 'react-bootstrap';
import { handleLogOut } from '../components/Navbar';
import { UserContext } from './UserContext';

const ErrorContext = createContext()

// ErrorProvider is used to display the error messages and toasts which are modals, the ErrorProvider is wrapped around the App component in index.js
export function ErrorProvider({children}) {
    const userContext = useContext(UserContext);
    const [error, setError] = useState('-1');
    const [toast, setToast] = useState('');
    const [theme, setTheme] = useState('dark');
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
        if(error.status === ''){
            setError('-1');
            if (userContext?.setLoggedIn) {
                handleLogOut();
            }
        }

        setTheme(localStorage.getItem('selectedTheme'));
    }, [error, toast, userContext]);

    return (
        <ErrorContext.Provider value={{error, setError, toast, setToast, theme}}>
            {children}
            <Modal show={error !== '-1'} onHide={() => setError('-1')} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {messages[error] || 'An error occurred'}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setError('-1')}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="bottom-end" className="p-3">
                <Toast show={toast !== ''} onClose={() => setToast('')} delay={7000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>{toast}</Toast.Body>
                </Toast>
            </ToastContainer>
        </ErrorContext.Provider>
    )
}

export function useErrors() {
    return useContext(ErrorContext);
}

// Add default export for module federation
export default { ErrorProvider };

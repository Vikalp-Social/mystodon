import React, { useState, useContext, createContext, useEffect } from 'react'
import { Modal, Button, Toast, ToastContainer } from 'react-bootstrap';
import { handleLogOut } from '../components/Navbar';
import { UserContext } from './UserContext';

const ErrorContext = createContext()

// ErrorProvider is used to display the error messages and toasts which are modals, the ErrorProvider is wrapped around the App component in index.js
export function ErrorProvider({children}) {
    const {setLoggedIn} = useContext(UserContext);
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
            handleLogOut();
        }

        setTheme(localStorage.getItem('selectedTheme'));
    })

    return (
        <ErrorContext.Provider value={{setError, setToast}}>
            {children}

            {/* if the error status is empty it means there was an error formatting the error */}
            {error.status === '' ? handleLogOut() : null}   
            
            {/* modal for displaying error messages */}
            <Modal show={error !== '-1'} onClose={() => setError('-1')} size='tiny' data-bs-theme={theme}>
                <Modal.Header closeButton>{error.statusText} ({error.status})</Modal.Header>
                <Modal.Body>
                <p>
                {error.error}
                </p>
                <hr />
                <p>{messages[error.status]}</p>
                </Modal.Body>
                <Modal.Footer>
                    {(error.status === 401) || (error.status === 404) ? <Button onClick={() => {setError('-1'); setLoggedIn(false); handleLogOut()}}>Logout</Button>
                     : <Button onClick={() => {setError('-1'); window.location.pathname = "/home"}}>Close</Button>

                    }
                </Modal.Footer>
            </Modal>

            {/* toast for displaying popups/info messages */}
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

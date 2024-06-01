import React from 'react'
import { Alert } from 'react-bootstrap'

function Error(props) {
    return (
        <Alert variant="success" show={props.show}>
            <Alert.Heading>Hey, nice to see you</Alert.Heading>
            <p>
            {props.error}
            </p>
            <hr />
            <p className="mb-0">
            Whenever you need to, be sure to use margin utilities to keep things
            nice and tidy.
            </p>
        </Alert>
    );
}

export default Error
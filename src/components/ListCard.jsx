import React from 'react'
import { useNavigate } from 'react-router-dom'

function ListCard(props) {
    let navigate = useNavigate();

    return (
        <div className='list' key={props.id} onClick={() => navigate(`/lists/${props.type}/${props.id}`)}>
            {props.title} - {props.owner}
            {props.type == "private" && props.is_public && <div className='public-list'>Public</div>}
            <div className='list-buttons'>
                <button className='my-button edit-button' onClick={(e) => props.edit(e, props.id)}>Edit</button>
                {props.type == "private" && props.is_public ?
                    <button className='my-button delete-button' onClick={(e) => props.remove(e, props.id)}>Remove</button>
                    :
                    <button className='my-button delete-button' onClick={(e) => props.delete(e, props.id)}>Delete</button>
                }
                
            </div>
        </div>
    )
}

export default ListCard
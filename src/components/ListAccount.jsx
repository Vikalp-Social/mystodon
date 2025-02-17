import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import APIClient from "../apis/APIClient";
import { UserContext } from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import UsernameEmoji from "./UsernameEmoji";

// Component to display the search results of accounts
function ListAccount(props) {
    const {currentUser, paths} = useContext(UserContext);
    const {setError} = useErrors();
    const [removed, setRemoved] = useState(false);
    let navigate = useNavigate();

    function handleUserClick(){
        navigate(`${paths.profile}/${props.user_id}`)
    }

    async function addAccount(event){
        event.stopPropagation();
        setRemoved(false);
        props.add();
    }

    async function removeAccount(event){
        event.stopPropagation();
        setRemoved(true);
        props.remove()
    }

    return(
        <div className="search" onClick={handleUserClick}>
            <div className="statusTop">
                <div className="statusTopLeft">
                    <img className="statusProfileImg" src={props.prof} alt="profile" />
                    <div className="user">
                        <span className="statusUsername" onClick={handleUserClick}><UsernameEmoji name={props.display_name || props.username} emojis={props.emojis} /></span>
                        {/* this is done to reduce the length of the fullname and prevent overflow */}
                        <span className="userInstance">{props.fullname.length > 47 ? props.fullname.slice(0, 40) + '...' : props.fullname}</span>
                    </div>
                </div>
                <div>
                    {!(props.viewOnly) && (props.check && !removed?
                        <button type="button" className="my-button"  onClick={(e) => removeAccount(e)}>Remove</button>
                    :
                        <button type="button" className="my-button" onClick={(e) => addAccount(e)}>Add</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListAccount;
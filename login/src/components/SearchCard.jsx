import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { UserContext } from "../context/UserContext";

function SearchCard(props) {
    const {currentUser} = useContext(UserContext);
    let navigate = useNavigate();

    function handleUserClick(){
        navigate(`/profile/${props.user_id}`)
    }

    async function handleFollow(event){
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/api/v1/statuses/${props.id}`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function handleUnfollow(event){
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/api/v1/statuses/${props.id}`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="status" onClick={() => console.log(props.check)}>
            <div className="statusTop">
                <div className="statusTopLeft">
                    <img className="statusProfileImg" src={props.prof} alt="profile" />
                    <div className="user">
                        <span className="statusUsername" onClick={handleUserClick}>{props.username}</span>
                        <span className="userInstance">{props.fullname}</span>
                    </div>
                </div>
                <div className="postTopRight">
                    <div>
                    {props.check ?
                        <button type="button" class="btn btn-outline-danger" onClick={handleUnfollow}>Unfollow</button>
                    :
                        <button type="button" class="btn btn-outline-secondary" onClick={handleFollow}>Follow</button>
                    }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchCard;
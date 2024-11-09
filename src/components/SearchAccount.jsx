import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import APIClient from "../apis/APIClient";
import { UserContext } from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import UsernameEmoji from "./UsernameEmoji";

// Component to display the search results of accounts
function SearchAccount(props) {
    const {currentUser, paths} = useContext(UserContext);
    const {setError} = useErrors();
    const [isFollowing, setFollowing] = useState(false);
    let navigate = useNavigate();

    function handleUserClick(){
        navigate(`${paths.profile}/${props.user_id}`)
    }

    useEffect(() => {
        checkRelation();
    }, [])

    //function to check if the user is following the searched account
    async function checkRelation(){
        try {
            const response = await axios.get(`https://${currentUser.instance}/api/v1/accounts/relationships`, {
                params: {"id[]" : props.user_id},
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
            setFollowing(response.data[0].following);
        } catch (error) {
            console.log(error);
        }
    }

    //function to handle the follow button
    async function handleFollow(event){
        event.stopPropagation();
        try {
            const response = await APIClient.post(`/accounts/${props.user_id}/follow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(true);
        } catch (error) {
            setError(error.response.data);
        }
    }

    //function to handle the unfollow button
    async function handleUnfollow(event){
        event.stopPropagation();
        try {
            const response = await APIClient.post(`/accounts/${props.user_id}/unfollow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(false);
        } catch (error) {
            setError(error.response.data);;;
        }
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
                    {isFollowing ?
                        <button type="button" className="my-button"  onClick={(e) => handleUnfollow(e)}>Unfollow</button>
                    :
                        <button type="button" className="my-button" onClick={(e) => handleFollow(e)}>Follow</button>
                    }
                </div>
            </div>
        </div>
    );
}

export default SearchAccount;
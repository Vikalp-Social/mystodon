import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import UsernameEmoji from "./UsernameEmoji";

function SearchAccount(props) {
    const {currentUser} = useContext(UserContext);
    const {setError} = useErrors();
    const [isFollowing, setFollowing] = useState(false);
    let navigate = useNavigate();

    console.log(props)

    function handleUserClick(){
        navigate(`/profile/${props.user_id}`)
    }

    useEffect(() => {
        checkRelation();
    }, [])

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

    async function handleFollow(){
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/accounts/${props.user_id}/follow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(true);
        } catch (error) {
            setError(error.response.data);
        }
    }

    async function handleUnfollow(){
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/accounts/${props.user_id}/unfollow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(false);
        } catch (error) {
            setError(error.response.data);;;
        }
    }

    return(
        <div className="search">
            <div className="statusTop">
                <div className="statusTopLeft">
                    <img className="statusProfileImg" src={props.prof} alt="profile" />
                    <div className="user">
                        <span className="statusUsername" onClick={handleUserClick}><UsernameEmoji name={props.username} emojis={props.emojis} /></span>
                        <span className="userInstance">{props.fullname.length > 47 ? props.fullname.slice(0, 40) + '...' : props.fullname}</span>
                    </div>
                </div>
                <div>
                    <div>
                    {isFollowing ?
                        <button type="button" className="my-button"  onClick={handleUnfollow}>Unfollow</button>
                    :
                        <button type="button" className="my-button" onClick={handleFollow}>Follow</button>
                    }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchAccount;
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import APIClient from "../apis/APIClient";
import { UserContext } from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";

// SearchTag component is used to display the search results of the tags
function SearchTag(props) {
    const {currentUser, paths} = useContext(UserContext);
    const {setError} = useErrors();
    const [isFollowing, setFollowing] = useState(false);
    let navigate = useNavigate();

    function handleUserClick(){
        navigate(`${paths.tags}/${props.name}`)
    }

    useEffect(() => {
        checkRelation();
    }, [])

    async function checkRelation(){
        try {
            const response = await axios.get(`https://${currentUser.instance}/api/v1/tags/${props.name}`, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
            setFollowing(response.data.following);
        } catch (error) {
            setError(error.response.data);;;
        }
    }

    async function handleFollow(){
        try {
            const response = await APIClient.post(`/tags/${props.name}/follow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(true);
        } catch (error) {
            setError(error.response.data);;;
        }
    }

    async function handleUnfollow(){
        try {
            const response = await APIClient.post(`/tags/${props.name}/unfollow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(false);
        } catch (error) {
            setError(error.response.data);;;
        }
    }

    return(
        <div className="search" onClick={checkRelation}>
            <div className="statusTop">
                <div className="statusTopLeft">
                    <div className="user">
                        <span className="statusUsername" onClick={handleUserClick}>#{props.name}</span>
                        {props.talking > 0 && <span className="userInstance">{props.talking} {props.talking > 1  ? "people talking" : "person talking"} </span>}
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

export default SearchTag;
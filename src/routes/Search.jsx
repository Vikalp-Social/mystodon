import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import APIClient from "../apis/APIClient";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchAccount from "../components/SearchAccount";
import SearchTag from "../components/SearchTag";
import Status from "../components/Status";
import Headbar from "../components/Headbar";
import { UserContext } from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import "../styles/search.css";
import ThemePicker from "../theme/ThemePicker";

// Search component is the main component that is rendered when the user searches for something.
function Search(){
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {setError} = useErrors();
    const {q} = useParams();
    const [viewStatus, setStatus] = useState(true);
    const [viewAccount, setAccount] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [maxId, setMaxId] = useState("");
    let navigate = useNavigate()

    useEffect(() => {
        document.title = "Search | Vikalp";
    }, [])

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }
        // function to fetch the data related to the search query
        async function fetchData() {
            try {
                setLoading(true);
                const response = await APIClient.get(`/search`, {
                    params: {
                        q: q,
                        token: currentUser.token,
                        instance: currentUser.instance,
                    }
                });
                setAccounts(response.data.accounts);
                setStatuses(response.data.statuses);
                setHashtags(response.data.hashtags);
                setMaxId(response.data.max_id);
                setLoading(false);
            } catch (error) {
                setError(error.response.data);;;
            }
        }
        fetchData();
    }, [q]);

    return (
        <div className="main">
            <Navbar />
            <Sidebar />
            <ThemePicker />
            <div className="feed container" >
                <Headbar />
                <div className="search-options">
                    <div onClick={() => {setStatus(true);setAccount(false)}} className={viewStatus ? "active-option" : ""}>Statuses</div>
                    <div onClick={() => {setStatus(false);setAccount(true)}} className={viewAccount ? "active-option" : ""}>Accounts</div>
                    <div onClick={() => {setStatus(false);setAccount(false)}} className={!viewStatus && !viewAccount ? "active-option" : ""}>Hashtags</div>
                </div>
                {viewStatus ? 
                    (statuses.length > 0 ? statuses.map((status) => {
                        return <Status 
                            key={status.id}
                            instance={currentUser.instance}
                            reblogged={status.reblog ? true : false}
                            post={status.reblog? status.reblog : status}
                            postedBy={status.account}
                            isUserProfile={false}
                            mentions={status.mentions}
                        />
                    }) : <div className="no-results">No results found</div>)
                : 
                    (viewAccount ?
                        (accounts.length > 0 ? accounts.map((account) => {
                        return <SearchAccount 
                                key={account.id}
                                user_id={account.id}
                                prof={account.avatar}
                                username={account.display_name}
                                fullname={account.username === account.acct ? `${account.username}@${currentUser.instance}` : account.acct}
                                emojis={account.emojis}
                            />
                        }) : <div className="no-results">No results found</div>)
                    : 
                       (hashtags.length > 0 ? hashtags.map((tag) => {
                            return <SearchTag 
                                key={tag.name}
                                name={tag.name}
                                talking={tag.history[0].accounts}
                            />
                        }) : <div className="no-results">No results found</div>)
                    )
                }
                {loading && <div className="loader"></div>}
            </div>
        </div>
    );
}

export default Search;
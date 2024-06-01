import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios  from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchAccount from "../components/SearchAccount";
import SearchTag from "../components/SearchTag";
import Status from "../components/Status";
import Headbar from "../components/Headbar";
import { UserContext } from "../context/UserContext";
import "../styles/search.css";
import ThemePicker from "../theme/ThemePicker";

function Search(){
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {q} = useParams();
    const [viewStatus, setStatus] = useState(true);
    const [viewAccount, setAccount] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate()

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }
        async function fetchData() {
            try {
                setLoading(true);
                const response = await axios.post(`http://localhost:3000/api/v1/search`, {
                    q,
                    token: currentUser.token,
                    instance: currentUser.instance,
                });
                //console.log(response.data);
                setAccounts(response.data.accounts);
                setStatuses(response.data.statuses);
                setHashtags(response.data.hashtags);
                setLoading(false);
            } catch (error) {
                console.log(error.response.data);;
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
                    statuses.map((status) => {
                        return <Status 
                            key={status.id}
                            instance={currentUser.instance}
                            reblogged={status.reblog ? true : false}
                            post={status.reblog? status.reblog : status}
                            postedBy={status.account}
                            isUserProfile={false}
                            mentions={status.mentions}
                        />
                    })
                : 
                    (viewAccount ?
                        accounts.map((account) => {
                        return <SearchAccount 
                                key={account.id}
                                user_id={account.id}
                                prof={account.avatar}
                                username={account.display_name}
                                fullname={account.username === account.acct ? `${account.username}@${currentUser.instance}` : account.acct}
                            />
                        }) 
                    : 
                        hashtags.map((tag) => {
                            return <SearchTag 
                                key={tag.name}
                                name={tag.name}
                                talking={tag.history[0].accounts}
                            />
                        })
                    )
                }
                {loading && <div className="loader"></div>}
            </div>
        </div>
    );
}

export default Search;
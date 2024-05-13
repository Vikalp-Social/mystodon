import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios  from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchCard from "../components/SearchCard";
import Status from "../components/Status";
import { UserContext } from "../context/UserContext";

function Search(){
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {q} = useParams();
    const [viewStatus, setStatus] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [statuses, setStatuses] = useState([]);
    let navigate = useNavigate()

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }
        async function fetchData() {
            try {
                const response = await axios.post(`http://localhost:3000/api/v1/search`, {
                    q,
                    token: currentUser.token,
                    instance: currentUser.instance,
                });
                //console.log(response.data);
                setAccounts(response.data.accounts);
                setStatuses(response.data.statuses);

            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="main">
            <Navbar />
            <Sidebar />
            <div className="feed container" style={{marginBottom: "5px"}}>
                <div className="search-options">
                    <div onClick={() => setStatus(false)} className={viewStatus ? "" : "active-option"}>Accounts</div>
                    <div onClick={() => setStatus(true)} className={viewStatus ? "active-option" : ""}>Statuses</div>
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
                        />
                    })
                :
                    accounts.map((account) => {
                        return <SearchCard 
                            key={account.id}
                            user_id={account.id}
                            prof={account.avatar}
                            username={account.display_name}
                            fullname={account.acct}
                        />
                    })
                }
            </div>
        </div>
    );
}

export default Search;
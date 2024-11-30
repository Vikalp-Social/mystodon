import { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import APIClient from "../apis/APIClient";
import { UserContext } from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Headbar from "../components/Headbar";
import ThemePicker from "../theme/ThemePicker";
import SearchAccount from "../components/SearchAccount";
import SearchTag from '../components/SearchTag';

function FollowPage() {
	const {currentUser, isLoggedIn} = useContext(UserContext);
    const {setError} = useErrors();
    const {id, follow} = useParams();
    const [list, setList] = useState([]);
	const [tags, setTags] = useState([]);
	const [viewAccount, setAccount] = useState(true);
	const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

	useEffect(() => {
		if(!isLoggedIn){
			navigate("/");
		}
		if(follow !== "followers" && follow !== "following"){
			navigate("/");
		}
		fetchFollowList();
		console.log(id, follow);
	}, [id, follow]);

	async function fetchFollowList(){
		try {
			console.log("fetching");
			setLoading(true);
			const response = await APIClient.get(`accounts/${id}/${follow}`, {
				params: {
					instance: currentUser.instance,
					token: currentUser.token
				}
			});
			console.log(response.data);
			setList(response.data.accounts);

			const tags = await APIClient.get("tags/following", {
				params: {
					instance: currentUser.instance,
					token: currentUser.token
				}
			});
			console.log(tags.data);
			setTags(tags.data);

			setLoading(false);
			console.log("done fetching");
		} catch (error) {
			setError(error.response.data);
		}
	}


	return (
		<div className="main">
            <Navbar />
            <Sidebar />
            <ThemePicker />
            <div className="feed container" >
                <Headbar />
					{follow === "following" ? 
						<div className="search-options">
							<div onClick={() => setAccount(true)} className={viewAccount ? "active-option" : ""}>Accounts</div>
							<div onClick={() => setAccount(false)} className={!viewAccount ? "active-option" : ""}>Hashtags</div>
						</div> 
						: 
						<div></div>
					}
					{viewAccount && (list.length > 0 ? list.map((account) => {
                        return <SearchAccount 
                                key={account.id}
                                user_id={account.id}
                                prof={account.avatar}
                                username={account.display_name}
                                fullname={account.username === account.acct ? `${account.username}@${currentUser.instance}` : account.acct}
                                emojis={account.emojis}
                            />
                        })
						 : <div className="no-results">No results found</div>)}

					{!viewAccount && (tags.length > 0 ? tags.map((tag) => {
						return <SearchTag 
                                key={tag.name}
                                name={tag.name}
                                talking={tag.history[0].accounts}
                            />}	
					) : <div className="no-results">No results found</div>)}
                {loading && <div className="loader"></div>}
            </div>
        </div>
	)
}

export default FollowPage
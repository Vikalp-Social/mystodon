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

function FollowPage() {
	const {currentUser, isLoggedIn} = useContext(UserContext);
    const {setError} = useErrors();
    const {id, follow} = useParams();
    const [list, setList] = useState([]);
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
					{list.length > 0 ? list.map((account) => {
                        return <SearchAccount 
                                key={account.id}
                                user_id={account.id}
                                prof={account.avatar}
                                username={account.display_name}
                                fullname={account.username === account.acct ? `${account.username}@${currentUser.instance}` : account.acct}
                                emojis={account.emojis}
                            />
                        })
						 : <div className="no-results">No results found</div>}
                {loading && <div className="loader"></div>}
            </div>
        </div>
	)
}

export default FollowPage
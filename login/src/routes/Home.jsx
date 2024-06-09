import React, {useState, useContext, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext} from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import Status from "../components/Status";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Headbar from "../components/Headbar";
import ThemePicker from "../theme/ThemePicker";

function Home(){
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {setError, setToast} = useErrors();
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(false);
    const [maxId, setMaxId] = useState("");
    useBottomScrollListener(fetchTimeline);
    let navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }
        fetchTimeline();
    }, []);

    async function fetchTimeline() {
            try {
                setLoading(true);
                const response = await axios.post("http://localhost:3000/api/v1/timelines/home", {...currentUser, max_id: maxId});
                //console.log(response.data);
                setTimeline([...timeline, ...response.data.data])
                setMaxId(response.data.max_id);
                setLoading(false);
            } catch (error) {
                setError(error.response.data);
            }
        }

    return (
        <>
            <div className="main">
                <ThemePicker />
                <Navbar />
                <Sidebar />
                <div className="feed container">
                    <Headbar />
                    {timeline.map(status => {
                        return <Status 
                            key={status.id}
                            instance={currentUser.instance}
                            reblogged={status.reblog ? true : false}
                            post={status.reblog? status.reblog : status}
                            postedBy={status.account}
                            isUserProfile={false}
                            mentions={status.mentions}
                        />
                    })}
                    {loading && <div className="load-container"><div className="loader"></div></div>}
                    {!loading && <button className="load-button" onClick={fetchTimeline}>Load More</button>}
                    
                </div>
            </div>
        </>
    );
}

export default Home;
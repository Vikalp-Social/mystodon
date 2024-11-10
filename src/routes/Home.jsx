import React, {useState, useContext, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import APIClient from "../apis/APIClient";
import { UserContext} from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import Status from "../components/Status";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Headbar from "../components/Headbar";
import ThemePicker from "../theme/ThemePicker";

// Home component is the main component that is rendered when the user logs in. It fetches the timeline of the user and displays the posts in the timeline.
function Home(){
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {setError} = useErrors();
    const [timeline, setTimeline] = useState([]);
    const [buffer, setBuffer] = useState([]);
    const [loading, setLoading] = useState(false);
    const [maxId, setMaxId] = useState("");
    useBottomScrollListener(extendTimeline);
    let navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }
        fetchTimeline();
        document.title = "Home | Vikalp";
    }, []);

    // function to fetch the timeline of the user
    async function fetchTimeline() {
        try {
            setLoading(true);
            const response = await APIClient.get("/timelines/home", {
                params: {
                    token: currentUser.token, 
                    instance: currentUser.instance, 
                    max_id: maxId
                }
            });
            setTimeline([...timeline, ...response.data.data])
            //setLoading(false);
            const res2 = await APIClient.get("/timelines/home", {
                params: {
                    token: currentUser.token, 
                    instance: currentUser.instance, 
                    max_id: response.data.max_id
                }
            });
            setBuffer(res2.data.data);
            setMaxId(res2.data.max_id);
        } catch (error) {
            setError(error.response.data);
        }
    }

    async function extendTimeline() {
        if(buffer.length > 0){
            setLoading(true);
            if(timeline.includes(buffer[0])){
                //setLoading(true)
                fetchTimeline();
            }
            else{
                setTimeline([...timeline, ...buffer]);
                //setLoading(false);
                const res2 = await APIClient.get("/timelines/home", {params: {token: currentUser.token, instance: currentUser.instance, max_id: maxId}});
                setBuffer(res2.data.data);
                setMaxId(res2.data.max_id);
            }
        }
        else{
            fetchTimeline();
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
                    {timeline.length > 0 && timeline.map(status => {
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
                    {loading && <div className="loader"></div>}
                    {/* {!loading && <button className="load-button" onClick={extendTimeline}>Load More</button>} */}
                    
                </div>
            </div>
        </>
    );
}

export default Home;
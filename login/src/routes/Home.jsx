import React, {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext} from "../context/UserContext";
import Status from "../components/Status";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Home(){
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const [timeline, setTimeline] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }

        async function fetchTimeline() {
            try {
                //console.log(currentUser);
                const response = await axios.post("http://localhost:3000/api/v1/timelines/home", currentUser);
                //console.log(response.data.data.timeline);
                setTimeline(response.data.data.timeline)
            } catch (error) {
                console.log(error);
            }
        }
        fetchTimeline();
    }, []);

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="feed container">
                {timeline.map(status => {
                    return <Status 
                        key={status.id}
                        instance={currentUser.instance}
                        reblogged={status.reblog ? true : false}
                        post={status.reblog? status.reblog : status}
                        postedBy={status.account}
                        isUserProfile={false}
                    />
                })}
            </div>
        </>
        
    );
}

export default Home;
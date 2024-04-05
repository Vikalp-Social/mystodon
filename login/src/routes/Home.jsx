import React, {useState, useContext, useEffect} from "react";
import axios from "axios";
import { UserContext} from "../context/UserContext";

function Home(){
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
        async function fetchTimeline() {
            try {
                console.log(currentUser);
                const response = await axios.post("http://localhost:3000/api/v1/timelines/home", currentUser);
                console.log(response.data);
                setTimeline(response.data.data.timeline)
            } catch (error) {
                console.log(error);
            }
        }
        fetchTimeline();
    }, [])


    return (
        <div className="homelayout">
            <div className="sidebar">SIDEBAR</div>
            <div className="feed">
                HOME
            </div>
            <div className="sidebar">OTHERSIDEBAR</div>
        </div>
    );
}

export default Home;
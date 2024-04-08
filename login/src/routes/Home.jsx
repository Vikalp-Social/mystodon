import React, {useState, useContext, useEffect} from "react";
import axios from "axios";
import { UserContext} from "../context/UserContext";
import Status from "../components/Status";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Home(){
    const {currentUser} = useContext(UserContext);
    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
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
    }, [timeline])

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="feed container">
                {timeline.map(status => {
                    return <Status 
                        key={status.id}
                        id={status.id}
                        user_id={status.account.id}
                        prof={status.account.avatar}
                        name={status.account.username}
                        instance={currentUser.instance} 
                        fullname={status.account.acct} 
                        body={status.content} 
                        src={status.media_attachments.length ? status.media_attachments[0] : ""}
                        isUserProfile={false}
                    />
                })}
            </div>
        </>
        
    );
}

export default Home;
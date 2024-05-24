import React, {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext} from "../context/UserContext";
import Status from "../components/Status";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ThemeSwitcher from "../components/ThemeSwitcher";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
    color: "var(--status_background)",
}

// Default values shown  
function Home(){
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }

        async function fetchTimeline() {
            try {
                //console.log(currentUser);
                setLoading(true);
                const response = await axios.post("http://localhost:3000/api/v1/timelines/home", currentUser);
                //console.log(response.data.data.timeline);
                setTimeline(response.data)
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        fetchTimeline();
    }, []);

    return (
        <>
            <div className="main">
                <Navbar />
                <Sidebar />
                <ThemeSwitcher />
                <div className="feed container">
                    {loading && <div className="load-container"><div className="loader"></div></div>}
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
            </div>
        </>
    );
}

export default Home;
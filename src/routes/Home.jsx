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
import axios from "axios";

// Home component is the main component that is rendered when the user logs in. It fetches the timeline of the user and displays the posts in the timeline.
function Home(){
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {setError} = useErrors();
    const [lists, setLists] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [buffer, setBuffer] = useState([]);
    const [loading, setLoading] = useState(false);
    const [maxId, setMaxId] = useState("");
    const [selectedId, setSelectedId] = useState("");
    useBottomScrollListener(extendHelper);
    let navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }
        // fetchLists();
        // testCookieToken();
        document.title = "Home | Vikalp";
    }, []);

    useEffect(() => {
        fetchListTimeline();
    }, [selectedId]);

    async function extendHelper(){
        if(selectedId === ""){
            extendTimeline();
        }
        else{
            extendListTimeline();
        }
    }

    async function fetchLists(){
        try {
            const response = await APIClient.get("/lists", {
                params: {
                    instance: currentUser.instance,
                },
            });
            console.log(response.data);
            setLists(response.data);
        } catch (error) {
            setError(error.response.data);
        }
    }

    async function fetchListTimeline(){
            console.log(selectedId);
            try {
                if (selectedId === "" ){

                    fetchHomeTimeline();
                    return;
                }
                setLoading(true);
                const response = await APIClient.get(`/timelines/lists/${selectedId}`, {
                    params: {
                        instance: currentUser.instance,
                        max_id: maxId,
                    },
                });
                setTimeline(response.data.data);
                console.log(response.data);
                const res2 = await APIClient.get(`/timelines/lists/${selectedId}`, {
                    params: {
                        instance: currentUser.instance,
                        max_id: response.data.max_id,
                    },
                });
                console.log(res2.data);
                setBuffer(res2.data.data);
                setMaxId(res2.data.max_id);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.response.data);
            }
        }

    // function to fetch the timeline of the user
    async function fetchHomeTimeline() {
        try {
            setLoading(true);
            const response = await APIClient.get("/timelines/home", {
                params: {
                    instance: currentUser.instance, 
                    max_id: maxId
                },
            });
            // console.log("home");
            // console.log(response.data)
            setTimeline(response.data.data)
            //setLoading(false);
            const res2 = await APIClient.get("/timelines/home", {
                params: {
                    instance: currentUser.instance, 
                    max_id: response.data.max_id
                },
            });
            // // const res2 = await axios.get("https://hot.srg.social/api/v1/timelines/home", {params: {token: currentUser.token, instance: currentUser.instance, max_id: response.data.max_id}});
            setBuffer(res2.data.data);
            setMaxId(res2.data.max_id);
        } catch (error) {
            console.log(error);
            // setError(error.response.data);
        }
    }

    async function extendTimeline() {
        if(buffer.length > 0){
            setLoading(true);
            if(timeline.includes(buffer[0])){
                //setLoading(true)
                fetchHomeTimeline();
            }
            else{
                setTimeline([...timeline, ...buffer]);
                //setLoading(false);
                const res2 = await APIClient.get("/timelines/home", {
                    params: {
                        instance: currentUser.instance, 
                        max_id: maxId
                    },
                });
                setBuffer(res2.data.data);
                setMaxId(res2.data.max_id);
            }
        }
        else{
            fetchHomeTimeline();
        }
    }

    async function extendListTimeline() {
        if(buffer.length > 0){
            setLoading(true);
            if(timeline.includes(buffer[0])){
                //setLoading(true)
                fetchListTimeline();
            }
            else{
                setTimeline([...timeline, ...buffer]);
                //setLoading(false);
                const res2 = await APIClient.get(`/timelines/lists/${selectedId}`, {
                    params: {
                        instance: currentUser.instance, 
                        max_id: maxId
                    }
                });
                setBuffer(res2.data.data);
                setMaxId(res2.data.max_id);
            }
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
                    <div className="search-options">
                        {lists.length > 0 && <div onClick={() => {setSelectedId("");setMaxId("");}} className={selectedId == "" ? "active-option" : ""}>Home</div>}
                        {lists.length > 0 && lists.map(list => {
                            return <div key={list.id} onClick={() => {setSelectedId(list.id);setMaxId("");}} className={selectedId == list.id ? "active-option" : ""}>{list.title}</div>
                        })}
                    </div>
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
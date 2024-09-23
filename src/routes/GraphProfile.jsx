import React, { useEffect, useContext, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import APIClient from "../apis/APIClient";
import DOMPurify from "dompurify";
import { UserContext } from "../context/UserContext";
import { useErrors } from "../context/ErrorContext";
import Navbar from "../components/Navbar";
import Headbar from "../components/Headbar";
import "../styles/profile.css";
import ThemePicker from "../theme/ThemePicker";
import UsernameEmoji from "../components/UsernameEmoji";

import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape, { Core } from "cytoscape"; 
import cise from "cytoscape-cise";

Cytoscape.use(cise);

function GraphProfile({postAndContent}) {
    const {id} = useParams();
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {setError, setToast} = useErrors();
    const [user, setUser] = useState({
            avatar: "",
            username: "",
            acct: "",
            note: "",
        });
    const [statuses, setStatuses] = useState([]);
    const [following, setFollowing] = useState(false);
    const [followedBy, setFollowedBy] = useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const sanitizedHtml = DOMPurify.sanitize(user.note);
    let navigate = useNavigate();
    const [display_name, setDisplayName] = useState("");
    const cyRef = useRef(null);
    const containerRef = useRef<HTMLDivElement>(null)
    const [elements, setElements] = useState([{ data: { id: "You", label: "You" } }]);
    const [layout, setLayout] = useState({
        name: "cise",
        clusters: [],
        boundingBox: { x1: 0, y1: 0, w: 600, h: 600 },
    });
    const theme = localStorage.getItem("selectedTheme");

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }
        fetchUserProfile(); 
    }, [id]);

    useEffect(() => {
        checkRelation();
    }, []);

    useEffect(() => {
        document.title = `${user.display_name || user.username} (@${user.username === user.acct ? `${user.username}@${currentUser.instance}` : user.acct}) | Vikalp`;
    });

    // useEffect(() => {
    //     //resolve postAndContent
    //     if (containerRef.current) {
    //         const { width, height } = containerRef.current.getBoundingClientRect();
    //         var cleanIdAndContent = {};

    //         Object.keys(statuses).forEach((account) => {
    //         const temp = account.content
    //             .replace(/(<([^>]+)>)/gi, "")
    //             .replace("&#39;", "'");
    //         if (temp) {
    //             cleanIdAndContent[account.id] = temp;
    //         }
    //         });

    //         // if (Object.keys(cleanIdAndContent).length !== 0) {
    //         //     fetch("https://graph.vikalp.social", {
    //         //         method: "POST",
    //         //         body: JSON.stringify(cleanIdAndContent),
    //         //         headers: {
    //         //         "Content-type": "application/json; charset=UTF-8",
    //         //         },
    //         //     })
    //         //     .then((response) => response.json())
    //         //     .then((data) => {
    //         //     var newelements = [
    //         //         {
    //         //         data: {
    //         //             id: "No Posts From The User !",
    //         //             label: "No Posts From The User !",
    //         //         },
    //         //         },
    //         //     ];

    //             Object.keys(cleanIdAndContent).forEach((id) => {
    //                 newelements.push({
    //                 data: { id: id, label: trimString(cleanIdAndContent[id], 100) },
    //                 });
    //             });

    //             let clusterList = [];
    //             Object.keys(data).forEach((category) => {
    //                 let cluster = [];
    //                 newelements.push(
    //                 { data: { id: category, label: category }, classes: "category" }
    //                 // { data: { source: "You", target: category } }
    //                 );

    //                 Object.keys(data[category]).forEach((postId) => {
    //                 cluster.push(postId);
    //                 newelements.push({
    //                     data: { source: category, target: postId },
    //                 });
    //                 });
    //                 clusterList.push(cluster);
    //             });
    //             if (newelements.length > 1) {
    //                 newelements.splice(0, 1);
    //             }
    //             setElements([...newelements]);
    //             setLayout({
    //                 name: "cise",
    //                 clusters: clusterList,
    //                 boundingBox: { x1: 0, y1: 0, w: 600, h: 600 },
    //             });
    //             setLoading(false);
    //             })
    //             .catch((err) => {
    //             console.log(err.message);
    //             });
    //         }
    //     }
    // }, [statuses]);
    
    const cytoscapeStylesheet = [
        {
            selector: "node",
            style: {
            "background-color": theme == "dark" ? "#1976d2" : "#9ee1f7",
            width: "label",
            height: "label",
            // a single "padding" is not supported in the types :(
            "padding-top": "8",
            "padding-bottom": "8",
            "padding-left": "8",
            "padding-right": "8",
            // this fixes the text being shifted down on nodes (sadly no fix for edges, but it's not as obvious there without borders)
            "text-margin-y": -3,
            "text-background-padding": "20",
            shape: "round-rectangle",
            // label: 'My multiline\nlabel',
            },
        },
        {
            selector: ".category",
            style: {
            "background-color": theme == "dark" ? "purple" : "#90fc90",
            shape: "ellipse",
            width: function (ele) {
                return ele.degree() * 25;
            },
            height: function (ele) {
                return ele.degree() * 25;
            },
            "font-size": function (ele) {
                return ele.degree() * 25;
            },
            },
        },
        {
            selector: "node[label]",
            style: {
            label: "data(label)",
            "font-size": "24",
            color: theme == "dark" ? "#ffffff" : "#000000",
            "text-halign": "center",
            "text-valign": "center",
            "text-wrap": "wrap",
            "text-max-width": "300",
            },
        },
        {
            selector: "edge",
            style: {
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            opacity: 0.4,
            width: 1.5,
            },
        },
        {
            selector: "edge[label]",
            style: {
            label: "data(label)",
            "font-size": "12",
            "text-background-color": "white",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
            "text-margin-y": -4,
            // so the transition is selected when its label/name is selected
            "text-events": "yes",
            },
        },
        {
            selector: "node.highlight",
            style: {
            "border-color": "#FFF",
            "border-width": "2px",
            },
        },
        {
            selector: "node.semitransp",
            style: { opacity: 0.5 },
        },
        {
            selector: "edge.highlight",
            style: { "mid-target-arrow-color": "#FFF" },
        },
        {
            selector: "edge.semitransp",
            style: { opacity: 0.2 },
        },
        ];
    

    // function to fetch the profile details of the user
    async function fetchUserProfile(){
        try {
            setLoading(true);
            const response = await APIClient.get(`/accounts/${id}`, {params: {instance: currentUser.instance}});
            // console.log(response.data)
            setUser(response.data.account);
            setStatuses(response.data.statuses.list);
            setDisplayName(response.data.account.display_name);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError(error.response.data);;
        }
    }

    // function to check the relation of the user with the current user
    async function checkRelation(){
        try {
            const response = await axios.get(`https://${currentUser.instance}/api/v1/accounts/relationships`, {
                params: {"id" : id},
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
            setFollowing(response.data[0].following);
            setFollowedBy(response.data[0].followed_by)
        } catch (error) {
            console.log(error);
        }
    }

    // function to follow the user
    async function handleFollow(){
        try {
            const response = await APIClient.post(`/accounts/${id}/follow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(true);
        } catch (error) {
            setError(error.response.data);;;
        }
    }

    // function to unfollow the user
    async function handleUnfollow(){
        try {
            const response = await APIClient.post(`/accounts/${id}/unfollow`, {
                instance: currentUser.instance,
                token: currentUser.token,
            });
            setFollowing(false);
        } catch (error) {
            setError(error.response.data);
        }
    }

    function formatData(data){
        let message = data;
        if(data > 1000){
            message = `${(data/1000).toFixed(2)}k`;
            data = data/1000;
            if(data > 100) message = `${Math.round(data)}k`;
        }
        return message; 
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function trimString(str, maxLength) {
        if (str.length > maxLength) {
            return str.slice(0, maxLength) + "...";
        } else {
            return str;
        }
    }
    
    const handlePanToOrigin = () => {
        if (cyRef.current) {
            cyRef.current.fit();
            cyRef.current.center();
        }
    };
    


    return (
        <div className="main">
            <Navbar />
            <ThemePicker />
            <div className=" container">
                <Headbar />
                {loading && <div className="loader"></div>}
                <div className="profile">
                    <div className="header-container">
                        {user.header !== "https://mastodon.social/headers/original/missing.png" && <img className="profileHeader" src={user.header} />}
                        {followedBy && <div className="followed-by">Follows you</div>}
                    </div>
                    <div className="profileTop">
                        <div className="profileTopLeft">
                            <img className="profileImg" src={user.avatar} alt="profile" />
                        </div>
                        <div className="profileTopRight">
                            {/* show edit profile button only if the user is the current user */}
                            {currentUser.id === id ? 
                                <button type="button" className="btn btn-outline-secondary" onClick={handleShow}>Edit Profile</button>
                            :
                                <>
                                    {following ? 
                                        <button type="button" className="btn btn-outline-secondary" onClick={handleUnfollow}>Unfollow</button> 
                                    : 
                                        <button type="button" className="btn btn-outline-secondary" onClick={handleFollow}>Follow</button>
                                    }
                                </>
                            }
                        </div>
                    </div>
                    <div className="user">
                        <span className="profileUsername">{display_name === '' ? display_name : <UsernameEmoji key={user.id} name={user.display_name || user.username} emojis={user.emojis}/>}</span>
                        <span className="profileUserInstance">{user.username === user.acct ? `${user.username}@${currentUser.instance}` : user.acct}</span>
                    </div>
                    <div className="profileStats"><strong><span>{formatData(user.followers_count)}</span> Followers <span>{formatData(user.following_count)}</span> Following</strong></div>
                    <div className="profileCenter">
                        <span className="profileText"><div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></span>
                    </div>
                </div>
            
                {/* <h2 style={{textAlign: "center"}}>POSTS</h2>
                {statuses.length ? statuses.map(status => {
                    return (status.in_reply_to_account_id === null && <Status 
                        key={status.id}
                        instance={currentUser.instance}
                        reblogged={status.reblog ? true : false}
                        post={status.reblog ? status.reblog : status}
                        postedBy={status.account}
                        isUserProfile={id === currentUser.id}
                        mentions={status.mentions}
                        delete={handleDelete}
                    />)
                }) : <p>No Posts Yet!</p>} */}
            </div>
            
        </div>
    );
}

export default GraphProfile
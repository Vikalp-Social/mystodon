import React from 'react'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import APIClient from '../apis/APIClient'
import { UserContext } from '../context/UserContext'
import ThemePicker from '../theme/ThemePicker'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Headbar from '../components/Headbar'
import { useErrors } from '../context/ErrorContext'
import CreateList from '../components/CreateList'
import "../styles/lists.css"
import ListCard from '../components/ListCard'

function Lists() {
    const {currentUser} = useContext(UserContext);
    const {setError} = useErrors();
    const [show, setShow] = useState(false);
    const [lists, setLists] = useState([]);
    const [publicLists, setPublicLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState("public");
    const [maxId, setMaxId] = useState("");
    let navigate = useNavigate();

    // useEffect(() =>{
    //     fetchPublicLists();
    //     setLists(publicLists);
    // }, []);

    useEffect(() =>{
        document.title = "Lists | Vikalp"
        fetchPublicLists();
    }, []);

    useEffect(() => {
        fetchListHelper();
    }, [selectedId])

    async function fetchListHelper(){
        if(selectedId == "public"){
            fetchPublicLists();
            setLists(publicLists);
        }
        else if(selectedId == "private"){
            fetchLists();
        }
    }

    async function fetchLists(){
        try {
            const response = await APIClient.get("/lists", {
                params: {
                    token: currentUser.token,
                    instance: currentUser.instance,
                }
            });
            console.log(response.data);
            setLists(response.data);
        } catch (error) {
            setError(error.response.data);
        }
    }

    async function fetchPublicLists(){
        try {
            setLoading(true);
            const response = await axios.get("https://auth.srg.social/api/v1/lists/public");
            console.log(response.data);
            setPublicLists(response.data);
            setLists(response.data);
            setLoading(false);
        } catch (error) {
            // setError(error.response.data);
            console.log(error);
        }
    }

    async function deleteList(event, id){
        event.stopPropagation();
        if(id === ""){
            return;
        }
        try {
            const response = await APIClient.delete(`/lists/${id}`, {
                params: {
                    token: currentUser.token,
                    instance: currentUser.instance,
                }
            });
            console.log(response.data);
            fetchLists();
        }
        catch (error) {
            setError(error.response.data);
        }
    }

    async function removePublicList(event, id){
        event.stopPropagation();
        if(id == ""){
            return;
        }
        try {
            const response = await axios.delete(`https://auth.srg.social/api/v1/lists/public/${id}`)
            console.log(response.data);
            fetchLists()
        } catch (error) {
            setError(error.response.data);
        }
    }

    function editList(event, id){
        event.stopPropagation();
        if(selectedId == "private" && publicLists.some(publicList => publicList.id === id)){
            id += "1";
        }
        else if(selectedId === "private"){
            id += "0";
        }
        if(id === ""){
            return;
        }
        navigate(`/lists/${id}/edit`);
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
                        <div onClick={() => {setSelectedId("public");setMaxId("");}} className={selectedId == "public" ? "active-option" : ""}>Public</div>
                        <div onClick={() => {setSelectedId("private");setMaxId("");}} className={selectedId == "private" ? "active-option" : ""}>Private</div>
                    </div>
                    <div className='list-options'>
                        <button className='my-button' onClick={() => setShow(true)}>Create</button>
                    </div>
                    {lists.length > 0 ? lists.map(list => {
                        return (
                            <ListCard 
                                key={list.id}
                                id={list.id}
                                title={list.title}
                                owner={list.owner}
                                type={selectedId}
                                is_public = {publicLists.some(publicList => publicList.id === list.id)}
                                edit={editList}
                                remove={removePublicList}
                                delete={deleteList}
                            />
                        )
                    })
                    :
                    <div className="no-data">Create a list first!!</div>
                    }
                    <CreateList 
                        show={show} 
                        close={() => {setShow(false);fetchListHelper()}}
                        type={selectedId}
                    /> 
                    {loading && <div className="loader"></div>}
                    {/* {!loading && <button className="load-button" onClick={extendListTimeline}>Load More</button>} */}
                    
                </div>
            </div>
        </>
    );
}

export default Lists